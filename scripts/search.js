export function highlightText(text, regex) {
    if (!regex || !text) return text;
    return text.replace(regex, match => `<mark>${match}</mark>`);
}

export function filterBooks(books, searchRaw, currentFilter) {
    let regex = null;
    let hasRegexError = false;

    if (searchRaw) {
        try {
            regex = new RegExp(searchRaw, 'i');
        } catch {
            hasRegexError = true;
        }
    }

    if (hasRegexError) {
        return { filtered: [], regex: null, error: 'Invalid Regular Expression' };
    }

    const filtered = books.filter(b => {
        const matchesQuery = !regex || regex.test(b.title) || regex.test(b.author) || regex.test(b.tag || '');
        const matchesTag = currentFilter === 'all' || (b.tag && b.tag.toLowerCase() === currentFilter.toLowerCase());
        return matchesQuery && matchesTag;
    });

    return { filtered, regex, error: null };
}
