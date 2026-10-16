export const state = {
    books: [],
    currentFilter: 'all',
    searchQuery: ''
};

export function setBooks(newBooks) {
    state.books =newBooks;
}

export function addBooks(book) {
    state.books.unshift(book);
}

export function removeBook(id) {
    state.books = state.books.filter(b => b.id !== id);
}

export function setFilter(tag) {
    state.currentFilter = tag;
}

export function setSearchQuery(query) {
    state.searchQuery = query;
}