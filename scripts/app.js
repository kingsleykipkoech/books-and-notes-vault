import { getStoredBooks, saveBooks, fetchSeedBooks } from './storage.js';
import { state, setBooks, addBook, updateBook, removeBook, setFilter } from './state.js';
import { validateBookForm } from './validators.js';
import { updateDashboard, renderFilterButtons, renderBooks, updateHeroSpotlight } from './ui.js';

let uploadedImage = 'assets/book-cover.jpg';

function render() {
    const searchRaw = (document.getElementById('search-input')?.value || '').trim();
    renderBooks(state.books, state.currentFilter, searchRaw, handleRemove, handleEdit);
    updateDashboard(state.books);
    updateHeroSpotlight(state.books);
    renderFilterButtons(state.books, state.currentFilter, handleSelectFilter);
}

function handleRemove(id) {
    removeBook(id);
    saveBooks(state.books);
    render();
}

function handleEdit(id) {
    const book = state.books.find(b => b.id === id);
    if (!book) return;

    document.getElementById('book-edit-id').value = book.id;
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-author').value = book.author || '';
    document.getElementById('book-tag').value = book.tag || '';
    document.getElementById('book-pages').value = book.pages || '';
    document.getElementById('book-isbn').value = book.isbn || '';
    const elNotes = document.getElementById('book-notes');
    if (elNotes) elNotes.value = book.notes || '';
    const elSpotlight = document.getElementById('book-spotlight');
    if (elSpotlight) elSpotlight.checked = Boolean(book.isSpotlight);
    uploadedImage = book.cover || 'assets/book-cover.jpg';
    document.getElementById('modal-title').textContent = 'Edit Book';
    document.getElementById('book-modal').classList.add('active');
}

function handleSelectFilter(tag) {
    setFilter(tag);
    render();
}

async function init() {
    const elMotto = document.getElementById('reader-motto-display');
    const savedMotto = localStorage.getItem('vault_reading_motto');
    if (savedMotto && savedMotto !== 'A quiet space for every book.' && elMotto) {
        elMotto.textContent = `\u201C${savedMotto}\u201D`;
    }

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
    const prefModal = document.getElementById('preferences-modal');

    document.getElementById('open-modal-btn')?.addEventListener('click', () => {
        document.getElementById('book-edit-id').value = '';
        document.getElementById('modal-title').textContent = 'Add Book';
        document.getElementById('add-book-form')?.reset();
        const elNotes = document.getElementById('book-notes');
        if (elNotes) elNotes.value = '';
        const elSpotlight = document.getElementById('book-spotlight');
        if (elSpotlight) elSpotlight.checked = false;
        uploadedImage = 'assets/book-cover.jpg';
        document.getElementById('upload-status').textContent = 'Choose cover image from device';
        modal.classList.add('active');
    });
    document.getElementById('close-modal-btn')?.addEventListener('click', () => modal.classList.remove('active'));

    document.getElementById('open-preferences-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const elDisplay = document.getElementById('reader-motto-display');
        const fallbackMotto = elDisplay ? elDisplay.textContent.replace(/^[\u201C"']|[\u201D"']$/g, '').trim() : '';
        const savedMotto = localStorage.getItem('vault_reading_motto');
        const currentMotto = (savedMotto && savedMotto !== 'A quiet space for every book.') ? savedMotto : fallbackMotto;
        const mottoInput = document.getElementById('pref-motto-input');
        if (mottoInput) mottoInput.value = currentMotto;
        prefModal?.classList.add('active');
    });

    document.getElementById('close-preferences-btn')?.addEventListener('click', () => {
        prefModal?.classList.remove('active');
    });

    document.getElementById('save-preferences-btn')?.addEventListener('click', () => {
        const mottoInput = document.getElementById('pref-motto-input');
        const elDisplay = document.getElementById('reader-motto-display');
        const fallbackMotto = elDisplay ? elDisplay.textContent.replace(/^[\u201C"']|[\u201D"']$/g, '').trim() : '';
        const newMotto = (mottoInput?.value || '').trim() || fallbackMotto;
        localStorage.setItem('vault_reading_motto', newMotto);
        if (elDisplay) elDisplay.textContent = `\u201C${newMotto}\u201D`;
        prefModal?.classList.remove('active');
    });

    window.addEventListener('keydown', (e) => {
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
        if (e.key === '/' && !isInput) {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        } else if ((e.key === 'n' || e.key === 'N') && !isInput) {
            e.preventDefault();
            document.getElementById('book-edit-id').value = '';
            document.getElementById('modal-title').textContent = 'Add Book';
            document.getElementById('add-book-form')?.reset();
            const elNotes = document.getElementById('book-notes');
            if (elNotes) elNotes.value = '';
            const elSpotlight = document.getElementById('book-spotlight');
            if (elSpotlight) elSpotlight.checked = false;
            uploadedImage = 'assets/book-cover.jpg';
            document.getElementById('upload-status').textContent = 'Choose cover image from device';
            modal.classList.add('active');
        } else if (e.key === 'Escape') {
            if (modal?.classList.contains('active')) modal.classList.remove('active');
            if (prefModal?.classList.contains('active')) prefModal.classList.remove('active');
        }
    });

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

    function exportVaultData() {
        const blob = new Blob([JSON.stringify(state.books, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImportFile(file) {
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
    }

    document.getElementById('btn-export-json')?.addEventListener('click', exportVaultData);
    document.getElementById('pref-export-btn')?.addEventListener('click', exportVaultData);

    document.getElementById('btn-import-json')?.addEventListener('change', (e) => handleImportFile(e.target.files[0]));
    document.getElementById('pref-import-btn')?.addEventListener('change', (e) => handleImportFile(e.target.files[0]));

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

        const notes = (document.getElementById('book-notes')?.value || '').trim();
        const isSpotlight = Boolean(document.getElementById('book-spotlight')?.checked);

        const editId = document.getElementById('book-edit-id')?.value;
        const bookData = {
            id: editId || 'rec_' + Date.now(),
            title: title.trim(),
            author: author.trim(),
            tag: tag || 'General',
            pages: Number(document.getElementById('book-pages').value) || 0,
            isbn: isbn ? isbn.trim() : 'N/A',
            notes: notes,
            isSpotlight: isSpotlight,
            cover: uploadedImage
        };

        if (isSpotlight) {
            state.books.forEach(b => {
                if (b.id !== bookData.id) b.isSpotlight = false;
            });
        }

        if (editId) {
            updateBook(bookData);
        } else {
            addBook(bookData);
        }

        saveBooks(state.books);
        render();
        form.reset();
        document.getElementById('book-edit-id').value = '';
        document.getElementById('upload-status').textContent = 'Choose cover image from device';
        modal.classList.remove('active');
    });
}

init();
