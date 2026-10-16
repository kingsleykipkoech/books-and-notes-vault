# Books & Notes Vault

A personal reading catalog and technical library engineered with pure Vanilla HTML5, CSS3, and ES Modules.

## Features
- **Catalog Archives**: Dynamic grid of technical books with categories and custom cover support.
- **Reading Dashboard**: Real-time stats calculation (Total Books, Total Pages, Average Pages/Book).
- **Search & Filters**: Instant search by title/author with `<mark>` keyword highlighting and dynamic tag filters.
- **Add / Remove Books**: Modal dialog with regex validation for title, author, and optional ISBN.
- **Data Persistence**: Automatic synchronization with browser `localStorage`.
- **JSON Import / Export**: Back up and restore vault data via JSON file.
- **Keyboard Navigation**: Press `/` to focus search, `N` to add a new book, `Esc` to close modal.

## Project Structure
```text
books-and-notes-vault/
├── index.html
├── seed.json
├── README.md
├── assets/
│   ├── book-cover.jpg
│   ├── empty-book.svg
│   └── hero-bg.svg
├── scripts/
│   ├── app.js
│   ├── search.js
│   ├── state.js
│   ├── storage.js
│   ├── ui.js
│   └── validators.js
└── styles/
    ├── hero.css
    ├── main.css
    ├── nav.css
    └── vault.css
```

## Running the Application
Serve the directory with any local static HTTP server:
```bash
python3 -m http.server 3005
```
Open `http://localhost:3005` in your browser.
