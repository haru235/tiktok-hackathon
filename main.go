package main

import (
	// "database/sql"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"

	// "github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Content struct {
	Text      string    `json:"text"`
	Timestamp time.Time `json:"timestamp"`
}

func main() {
	// Database initialization commented out
	// var err error
	// db, err = sql.Open("mysql", "root:Headstarter-ehhms5@tcp(127.0.0.1:3306)/tiktok_hackathon")
	// if err != nil {
	//     log.Fatal(err)
	// }
	// db, err = sql.Open("mysql", dbURL)
	// connStr := "user=evanthoms password=password dbname=tiktok_hackathon sslmode=disable"
	// db, err = sql.Open("postgres", connStr)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer db.Close()

	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/submit", handleSubmit)
	http.HandleFunc("/ws", handleWebSocket)

	http.Handle("/dist/", http.StripPrefix("/dist/", http.FileServer(http.Dir("dist"))))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	log.Printf("Server is running on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	// Commented out content retrieval from the database
	// contents, err := getContents()
	// if err != nil {
	//     http.Error(w, err.Error(), http.StatusInternalServerError)
	//     return
	// }

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Passing nil instead of contents to the template
	tmpl.Execute(w, nil)
}

func handleSubmit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	content := r.FormValue("content")
	if content == "" {
		http.Error(w, "Content cannot be empty", http.StatusBadRequest)
		return
	}

	// <<<<<<< HEAD
	// 	_, err := db.Exec("INSERT INTO content (text_content) VALUES ($1)", content)
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusInternalServerError)
	// 		return
	// 	}
	// =======

	// Commented out the database insertion
	// _, err := db.Exec("INSERT INTO content (text_content) VALUES (?)", content)
	// if err != nil {
	//     http.Error(w, err.Error(), http.StatusInternalServerError)
	//     return
	// }
	// >>>>>>> 433a19b60fa8fa354f161be38f6c3fb6e3bee4aa

	// Publish new content to Redis
	newContent := Content{
		Text:      content,
		Timestamp: time.Now(),
	}
	jsonContent, _ := json.Marshal(newContent)
	err := redisClient.Publish(r.Context(), "new_content", jsonContent).Err()
	if err != nil {
		log.Printf("Error publishing to Redis: %v", err)
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
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

// Commented out the getContents function
// func getContents() ([]string, error) {
// 	rows, err := db.Query("SELECT text_content FROM content ORDER BY created_at DESC")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var contents []string
// 	for rows.Next() {
// 		var content string
// 		if err := rows.Scan(&content); err != nil {
// 			return nil, err
// 		}
// 		contents = append(contents, content)
// 	}

// 	return contents, nil
// }
