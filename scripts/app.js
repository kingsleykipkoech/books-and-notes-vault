import { getStoredBooks, saveBooks, fetchSeedBooks } from './storage.js';
import { state, setBooks, addBook, removeBook, setFilter } from './state.js';
import { validateBookForm } from './validators.js';
import { updateDashboard, renderFilterButtons, renderBooks } from './ui.js';

let uploadedImage = 'assets/book-cover.jpg';

function render() {
    const searchRaw = (document.getElementById('search-input')?.value || '').trim();
    renderBooks(state.books, state.currentFilter, searchRaw, handleRemove);
    updateDashboard(state.books);
    renderFilterButtons(state.books, state.currentFilter, handleSelectFilter);
}

function handleRemove(id) {
    removeBook(id);
    saveBooks(state.books);
    render();
}

function handleSelectFilter(tag) {
    setFilter(tag);
    render();
}

async function init() {
    const stored = getStoredBooks();
    if (stored) {
        setBooks(stored);
    } else {
        const seed = await fetchSeedBooks();
        setBooks(seed);
        saveBooks(seed);
    }
    render();
    setupEvents();
}

function setupEvents() {
    document.getElementById('search-input')?.addEventListener('input', render);

    const modal = document.getElementById('book-modal');
    document.getElementById('open-modal-btn')?.addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('close-modal-btn')?.addEventListener('click', () => modal.classList.remove('active'));

    window.addEventListener('keydown', (e) => {
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
        if (e.key === '/' && !isInput) {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        } else if ((e.key === 'n' || e.key === 'N') && !isInput) {
            e.preventDefault();
            modal.classList.add('active');
        } else if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Image Upload
    document.getElementById('book-image-file')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                uploadedImage = ev.target.result;
                document.getElementById('upload-status').textContent = `Selected: ${file.name}`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state.books, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import JSON
    document.getElementById('btn-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                if (Array.isArray(imported)) {
                    setBooks(imported);
                    saveBooks(state.books);
                    render();
                    alert(`Successfully imported ${imported.length} volumes.`);
                } else {
                    alert('Invalid JSON file format (must be an array of books).');
                }
            } catch {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    });

    // Form Submit with Validation
    const form = document.getElementById('add-book-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const tag = document.getElementById('book-tag').value.trim();
        const isbn = document.getElementById('book-isbn').value;

        const { isValid, errors } = validateBookForm(title, author, isbn);

        const errTitle = document.getElementById('err-title');
        const errAuthor = document.getElementById('err-author');
        const errIsbn = document.getElementById('err-isbn');

        if (errTitle) errTitle.style.display = errors.title ? 'block' : 'none';
        if (errAuthor) errAuthor.style.display = errors.author ? 'block' : 'none';
        if (errIsbn) errIsbn.style.display = errors.isbn ? 'block' : 'none';

        if (!isValid) return;

        addBook({
            id: 'rec_' + Date.now(),
            title: title.trim(),
            author: author.trim(),
            tag: tag || 'General',
            pages: Number(document.getElementById('book-pages').value) || 0,
            isbn: isbn ? isbn.trim() : 'N/A',
            cover: uploadedImage
        });

        saveBooks(state.books);
        render();
        form.reset();
        document.getElementById('upload-status').textContent = 'Choose cover image from device';
        modal.classList.remove('active');
    });
}

init();
