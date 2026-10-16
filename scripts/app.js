import { getStoredBooks, saveBooks, fetchSeedBooks } from './storage.js';
import { state, setBooks, addBook, removeBook, setFilter } from './state.js';
import { validateBookForm } from './validators.js';
import { updateDashboard, renderFilterButtons, renderBooks } from './ui.js'

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
    const modal =  document.getElementById('book-modal');
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
}