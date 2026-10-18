import { highlightText, filterBooks } from './search.js';

export function updateHeroSpotlight(books) {
    if (!books || books.length === 0) return;
    const featured = books.find(b => b.isSpotlight) || books.find(b => b.id === 'rec_0001') || books[0];
    const elCover = document.getElementById('spotlight-cover');
    const elTitle = document.getElementById('spotlight-title');
    const elAuthor = document.getElementById('spotlight-author');
    const elNotes = document.getElementById('spotlight-notes');

    if (elCover) {
        elCover.src = featured.cover || 'assets/book-cover.jpg';
        elCover.alt = featured.title;
    }
    if (elTitle) elTitle.textContent = featured.title;
    if (elAuthor) elAuthor.textContent = `by ${featured.author}`;
    if (elNotes) elNotes.textContent = featured.notes || '';
}

export function updateDashboard(books) {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);
    const avgPages = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;

    const elBooks = document.getElementById('stat-total-books');
    const elPages = document.getElementById('stat-total-pages');
    const elAvg = document.getElementById('stat-avg-pages');

    if (elBooks) elBooks.textContent = totalBooks;
    if (elPages) elPages.textContent = totalPages.toLocaleString();
    if (elAvg) elAvg.textContent = `${avgPages.toLocaleString()} pages`;
}

export function renderFilterButtons(books, currentFilter, onSelectTag) {
    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

    const uniqueTags = [...new Set(books.map(b => b.tag).filter(Boolean))];
    const tags = ['all', ...uniqueTags];

    filterBar.innerHTML = tags.map(tag => `
        <button class="filter-btn ${currentFilter === tag ? 'active' : ''}" data-tag="${tag}">
            ${tag === 'all' ? 'All' : tag}
        </button>
    `).join('');

    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => onSelectTag(btn.dataset.tag));
    });
}

export function renderBooks(books, currentFilter, searchRaw, onDeleteBook, onEditBook) {
    const grid = document.getElementById('book-grid');
    const feedback = document.getElementById('search-feedback');
    if (!grid) return;

    const { filtered, regex, error } = filterBooks(books, searchRaw, currentFilter);

    if (feedback) feedback.textContent = error || '';
    if (error) return;

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-subtle); grid-column: 1/-1; text-align: center; padding: 3rem;">No volumes found matching criteria.</p>';
        return;
    }

    grid.innerHTML = filtered.map(b => `
        <article class="book-card">
            <img src="${b.cover || 'assets/book-cover.jpg'}" alt="${b.title}" class="book-card-cover">
            <div>
                <h3 class="book-card-title">${highlightText(b.title, regex)}</h3>
                <p class="book-card-author">by ${highlightText(b.author, regex)}</p>
                <p style="font-size: 0.8rem; color: var(--text-subtle); margin-top: 0.25rem;">
                    ${b.pages ? b.pages + ' pages' : ''} ${b.isbn && b.isbn !== 'N/A' ? '• ' + b.isbn : ''}
                </p>
            </div>
            <div class="book-card-footer">
                <span class="book-tag">${b.tag || 'General'}</span>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-edit" data-id="${b.id}">Edit</button>
                    <button class="btn-delete" data-id="${b.id}">Remove</button>
                </div>
            </div>
        </article>
    `).join('');

    grid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => onDeleteBook(btn.dataset.id));
    });
    grid.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => onEditBook(btn.dataset.id));
    });
}
