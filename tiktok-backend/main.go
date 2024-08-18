package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	//"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

var db *sql.DB
var redisClient *redis.Client

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {
	// connStr := "user=evanthoms password=password dbname=tiktok_hackathon sslmode=disable"
	// db, err = sql.Open("postgres", connStr)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer db.Close()

	var err error

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	dbUrl := os.Getenv("DATABASE_URL")
	db, err = sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379" // Default value
	}

	redisClient = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	// CORS setup
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"https://tiktok-frontend.onrender.com"}), // Change this to the domain(s) you want to allow
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	mux := http.NewServeMux()
	mux.HandleFunc("/", handleIndex)
	mux.HandleFunc("/submit", handleSubmit)
	mux.HandleFunc("/ws", handleWebSocket)
	mux.Handle("/dist/", http.StripPrefix("/dist/", http.FileServer(http.Dir("dist"))))

	log.Printf("Server is running on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(mux)))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Get contents from the database
	contents, err := getContents()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Set the response header for JSON
	w.Header().Set("Content-Type", "application/json")

	// Encode contents to JSON and write to response
	if err := json.NewEncoder(w).Encode(contents); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		return
	}
}

type Content struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageURL    string `json:"imageUrl"`
}

func handleSubmit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("Received %s request, but POST is required", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON body
	var content Content
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&content); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate content
	if content.Title == "" || content.Description == "" || content.ImageURL == "" {
		log.Printf("Invalid content data received: %+v", content)
		http.Error(w, "Content fields cannot be empty", http.StatusBadRequest)
		return
	}

	// Insert content into the database
	log.Printf("Inserting content into database: %+v", content)
	_, err := db.Exec("INSERT INTO content (title, description, image_url) VALUES ($1, $2, $3)", content.Title, content.Description, content.ImageURL)
	if err != nil {
		log.Printf("Error inserting content into database: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Publish the content to Redis
	jsonContent, _ := json.Marshal(content)
	log.Printf("Publishing content to Redis: %s", string(jsonContent))
	err = redisClient.Publish(r.Context(), "new_content", jsonContent).Err()
	if err != nil {
		log.Printf("Error publishing to Redis: %v", err)
		http.Error(w, "Error publishing content", http.StatusInternalServerError)
		return
	}

	log.Printf("Content successfully handled: %+v", content)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	pubsub := redisClient.Subscribe(r.Context(), "new_content")
	defer pubsub.Close()

	for {
		msg, err := pubsub.ReceiveMessage(r.Context())
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Received message from Redis:", msg.Payload)

		if err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
			log.Println(err)
			return
		}
	}
}

func getContents() ([]Content, error) {
	rows, err := db.Query("SELECT title, description, image_url FROM content ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contents []Content
	for rows.Next() {
		var content Content
		if err := rows.Scan(&content.Title, &content.Description, &content.ImageURL); err != nil {
			return nil, err
		}
		contents = append(contents, content)
	}

	return contents, nil
}
