package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	// Replace with your actual database connection string
	connStr := "user=evanthoms dbname=mydatabase sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/upload", uploadHandler).Methods("POST")

	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody map[string]string
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	content := requestBody["content"]
	if content == "" {
		http.Error(w, "Content is required", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO content (text_content) VALUES ($1)", content)
	if err != nil {
		http.Error(w, "Failed to insert content", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Content successfully inserted"))
}
