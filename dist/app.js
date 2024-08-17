"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
require("./styles/tailwind.css");
const socket = new WebSocket('ws://' + window.location.host + '/ws');
const notifications = document.getElementById('notifications');
const contentList = document.getElementById('content-list');
const contentForm = document.getElementById('contentForm');
socket.onmessage = function (event) {
    const content = JSON.parse(event.data);
    notifications.style.display = 'block';
    notifications.innerHTML = `New content added: "${content.text}" at ${new Date(content.timestamp).toLocaleString()}`;
    const newItem = document.createElement('li');
    newItem.textContent = content.text;
    contentList.insertBefore(newItem, contentList.firstChild);
    setTimeout(() => {
        notifications.style.display = 'none';
    }, 10000);
};
contentForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the page from reloading
    const formData = new FormData(contentForm);
    const content = formData.get('content');
    fetch('/submit', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log('Content submitted successfully');
            contentForm.reset(); // Clear the textarea
        }
        else {
            console.error('Error submitting content');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});
