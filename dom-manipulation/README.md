# Dynamic Quote Generator

A dynamic web application built with vanilla JavaScript that allows users to generate, view, add, and manage quotes. The application features advanced DOM manipulation, local data persistence, JSON file handling, and simulated server synchronization with conflict resolution.

## 🚀 Features

### Core Functionality
- **Random Quote Display:** Displays a random quote with its category upon loading or clicking the "Show New Quote" button.
- **Add New Quotes:** Users can input text and a category to add new quotes to the list.
- **Dynamic DOM Updates:** The interface updates instantly without requiring a page reload.

### Data Persistence & Management
- **Local Storage:** Quotes are saved to the browser's Local Storage, ensuring data persists even after refreshing the page.
- **Session Storage:** The application remembers the last viewed quote and the selected filter category during the active session.
- **Category Filtering:** A dynamically populated dropdown menu allows users to filter quotes by category.

### Import / Export System
- **JSON Export:** Users can download their current collection of quotes as a `.json` file using Blob generation.
- **JSON Import:** Users can upload a `.json` file to bulk-import quotes into the application.

### Server Simulation & Synchronization
- **Mock API Interaction:** Simulates fetching and posting data to a remote server (using JSONPlaceholder).
- **Auto-Sync:** Periodically syncs local data with the server (every 30 seconds).
- **Conflict Resolution:** Implements logic where server data takes precedence over local data in case of conflicts, preventing data overwrites.
- **Notifications:** Displays a UI notification when data is successfully synced.

## 🛠️ Technologies Used
- **HTML5**: Semantic structure.
- **CSS3**: Styling for a clean, modern user interface.
- **JavaScript (ES6+)**:
  - DOM Manipulation (`document.createElement`, `innerHTML`).
  - Web Storage API (`localStorage`, `sessionStorage`).
  - Asynchronous Programming (`async/await`, `fetch`).
  - File API (`FileReader`, `Blob`).

## 📂 Project Structure
```text
alx_fe_javascript/
└── dom-manipulation/
    ├── index.html      # Main HTML structure
    ├── script.js       # Application logic
    ├── styles.css      # Styling rules
    └── README.md       # Project documentation