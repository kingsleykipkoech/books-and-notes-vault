export const state = {
    books: [],
    currentFilter: 'all',
    searchQuery: ''
};

export function setBooks(newBooks) {
    state.books =newBooks;
}

export function addBook(book) {
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
export function updateBook(updateBook) {
    const index = state.books.findIndex(b => b.id === updateBook.id);
    if (index !== -1) {
        state.books[index] = { ...state.books[index], ...updateBook };
    }
}
