const STORAGE_KEY = 'vault_books';

export function getStoredBooks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
}

export function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export async function fetchSeedBooks() {
    const res = await fetch('./seed.json');
    return await res.json();
}
