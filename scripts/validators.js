export function validateBookForm(title,  author, isbn) {
    const regexTitle = /^\S(?:.*\S)?$/;
    const regexAuthor = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const regexIsbn = /^(?:97[89][- ]?)?[0-9]{1,5}[ -]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/i;
    const errors = {
        title: !regexTitle.test(title),
        author: !regexAuthor.test(author),
        isbn: isbn ? !regexIsbn.test(isbn) : false
    }

    const isValid = !errors.title && !errors.author && !errors.isbn;
    return { isValid, errors};
}