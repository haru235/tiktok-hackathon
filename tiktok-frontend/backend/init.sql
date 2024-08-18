CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO content (text_content) VALUES ('Welcome to the database!');