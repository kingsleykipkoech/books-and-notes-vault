# Books & Notes Vault

A personal reading catalog and digital archive dedicated to seminal books that inspired masterpiece movies, series, and cultural adaptations. Built with pure Vanilla HTML5, CSS3, and ES6 Modules without external framework dependencies.

---

## Live Demo & Repository
- **Live Website**: [https://kingsleykipkoech.github.io/books-and-notes-vault/](https://kingsleykipkoech.github.io/books-and-notes-vault/)
- **GitHub Repository**: [https://github.com/kingsleykipkoech/books-and-notes-vault](https://github.com/kingsleykipkoech/books-and-notes-vault)
- **Test Suite**: [https://kingsleykipkoech.github.io/books-and-notes-vault/test.html](https://kingsleykipkoech.github.io/books-and-notes-vault/test.html)

---

## Overview

The Books & Notes Vault explores the intersection of literature and cinema. It catalogs world-renowned books whose narratives became cinema classics (such as *The Godfather*, *The Hunger Games*, *The Shining*, and *Fight Club*). Users can curate their personal library, record reading stats, log summaries and quotes, and manage their collection locally.

---

## Key Features

### 1. Hero Spotlight & Best Pick
- Displays an enlarged, glassmorphic spotlight card featuring the curated pick of the month.
- Shows the book cover, title, author, and synopsis.
- Users can designate any book in their vault as the active spotlight pick.
- Styled with subtle ambient gold glow and backdrop-filter blur effects.

### 2. Full Catalog CRUD Management
- **Create**: Add new books with custom metadata including title, author, category, page count, ISBN, synopsis, and custom cover image upload.
- **Read**: Browse all volumes in a responsive, multi-column card grid.
- **Update**: Edit any book's details, notes, or spotlight status directly from the card.
- **Delete**: Remove books with immediate interface updates and storage synchronization.

### 3. Dynamic Search & Category Filtering
- **Regex-Powered Live Search**: Query by book title, author, category, or synopsis keywords.
- **Visual Highlighting**: Search terms are automatically highlighted with `<mark>` tags in real time.
- **Category Filter Bar**: Automatically generates filter pills based on tags present in the catalog (`All`, `Crime`, `Fantasy`, `Sci-Fi`, `Thriller`, etc.).
- **Safe Error Handling**: Prevents application crashes if users type unclosed regular expression characters (e.g. `[unclosed`).

### 4. Reading Analytics & Metrics Dashboard
- Calculates real-time statistics across the entire vault:
  - **Total Books**: Total volumes cataloged.
  - **Total Pages**: Aggregate reading volume.
  - **Average Pages / Book**: Computed reading density per volume.

### 5. Preferences & Data Backup
- **Reading Motto**: Customize the hero banner motto quote, persisted in browser memory.
- **JSON Export**: Download a full JSON backup of the library.
- **JSON Import**: Restore or merge catalog records from any valid JSON file.

### 6. Keyboard Shortcuts & Accessibility
- Press `/` to focus the search bar from anywhere on the page.
- Press `N` to open the Add Book dialog.
- Press `Esc` to dismiss any active modal.
- Native skip-to-content link for keyboard and screen-reader accessibility.

---

## File Structure

```text
books-and-notes-vault/
├── index.html              Main application markup and sections
├── seed.json               Initial catalog dataset (11 adapted classics)
├── test.html               In-browser feature verification suite
├── README.md               Project documentation and setup guide
├── assets/                 Cover art images and vector icons
│   ├── book-cover.jpg
│   ├── fightclub.jpg
│   ├── forestgump.jpg
│   ├── godfather.jpg
│   ├── heart.jpg
│   ├── history.jpg
│   ├── hunger.jpg
│   ├── jurrasic.jpg
│   ├── lamb.jpg
│   ├── princess.jpg
│   ├── rings.jpg
│   └── shining.jpg
├── scripts/                Modular JavaScript components
│   ├── app.js              Application initialization and event orchestration
│   ├── search.js           Search filtering and keyword text highlighting
│   ├── state.js            Central state store (books, active filter, query)
│   ├── storage.js          LocalStorage caching and JSON import/export
│   ├── ui.js               DOM rendering for cards, filters, and spotlight
│   └── validators.js       Form input validation rules
└── styles/                 Modular CSS design system
    ├── main.css            Design tokens, typography, root variables, resets
    ├── nav.css             Fixed glassmorphic navbar and brand logo
    ├── hero.css            Hero layout, ambient glow, and spotlight card
    └── vault.css           Catalog grid, stats cards, and modal forms
```

---

## Architecture & Code Design

The project uses native ECMAScript 6 modules to ensure clear separation of concerns:

- **State Management (`scripts/state.js`)**: An in-memory store managing the book array, active category filter, and search query. Any state modification triggers re-rendering.
- **Storage Layer (`scripts/storage.js`)**: Handles reading from `localStorage` under key `'vault_books'`, falling back to `seed.json` on the first visit.
- **UI Renderer (`scripts/ui.js`)**: Pure rendering functions that translate state into semantic HTML articles without framework overhead.
- **Validators (`scripts/validators.js`)**: RegEx validation enforcing valid non-empty titles, alphabetical author names, and standard ISBN-10/ISBN-13 formats.

---

## Running Locally

### Prerequisites
A modern web browser supporting ES6 Modules (Chrome, Firefox, Safari, Edge).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/kingsleykipkoech/books-and-notes-vault.git
   cd books-and-notes-vault
   ```

2. Start a local static file server:
   ```bash
   # Using Python 3
   python3 -m http.server 3000

   # Or using Node.js npx
   npx serve .
   ```

3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## Verification & Testing

The project includes an in-browser verification suite located at `test.html`. It tests 14 distinct functional requirements:

1. **Search & Filters**: Title/tag keyword matching, category isolation, regex error resilience, and `<mark>` text highlighting.
2. **Form Validation**: Acceptance of valid records, rejection of blank titles, rejection of blank authors, and invalid ISBN format detection.
3. **Vault Data & Storage**: Initial load, adding volumes with notes/spotlight flags, updating records, and deletion.
4. **Dashboard Calculations**: Accurate summation of total pages and computation of average pages per volume.

To run the verification suite:
- Navigate to `http://localhost:3000/test.html` in your browser, or
- Click the **Run Tests file** link in the website footer.

---

## Author

- **Kingsley Kipkoech**
  - GitHub: [https://github.com/kingsleykipkoech](https://github.com/kingsleykipkoech)
  - Project Repository: [https://github.com/kingsleykipkoech/books-and-notes-vault](https://github.com/kingsleykipkoech/books-and-notes-vault)

---

## License

This project is created for educational and portfolio purposes under the MIT License.
