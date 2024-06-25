const { getBookOpts, getFilteredBookOpts, getBookPaginatedOpts } = require("../../schema/v1/books");
const { getItemsOpts, postBookOpts, putBookOpts } = require("../../schema/v1/items")

let books = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", publicationYear: "1949" },
    { id: 2, title: "1984", author: "George Orwell", isbn: "9780451524935", publicationYear: "1949" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", publicationYear: "1925" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", publicationYear: "1813" },
    { id: 5, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", isbn: "9780590353427", publicationYear: "1997" },
    { id: 6, title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "9780316769488", publicationYear: "1951" },
    { id: 7, title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780618260300", publicationYear: "1937" },
    { id: 8, title: "Moby Dick", author: "Herman Melville", isbn: "9781853260087", publicationYear: "1851" },
    { id: 9, title: "War and Peace", author: "Leo Tolstoy", isbn: "9781427030200", publicationYear: "1869" },
    { id: 10, title: "Jane Eyre", author: "Charlotte Brontë", isbn: "9780141441146", publicationYear: "1847" },
    { id: 11, title: "The Lord of the Rings", author: "J.R.R. Tolkien", isbn: "9780618640157", publicationYear: "1954" },
    { id: 12, title: "The Chronicles of Narnia", author: "C.S. Lewis", isbn: "9780064471190", publicationYear: "1950" },
    { id: 13, title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", isbn: "9780141439761", publicationYear: "1865" },
    { id: 14, title: "Brave New World", author: "Aldous Huxley", isbn: "9780060850524", publicationYear: "1932" },
    { id: 15, title: "Catch-22", author: "Joseph Heller", isbn: "9780684833392", publicationYear: "1961" },
    { id: 16, title: "The Odyssey", author: "Homer", isbn: "9780140268867", publicationYear: "8th century BCE" },
    { id: 17, title: "Crime and Punishment", author: "Fyodor Dostoevsky", isbn: "9780679734505", publicationYear: "1866" },
    { id: 18, title: "Frankenstein", author: "Mary Shelley", isbn: "9780486282114", publicationYear: "1818" },
    { id: 19, title: "Don Quixote", author: "Miguel de Cervantes", isbn: "9780142437230", publicationYear: "1605" },
    { id: 20, title: "The Picture of Dorian Gray", author: "Oscar Wilde", isbn: "9780486278070", publicationYear: "1890" },
    { id: 21, title: "Les Misérables", author: "Victor Hugo", isbn: "9780451419439", publicationYear: "1862" },
    { id: 22, title: "Gulliver's Travels", author: "Jonathan Swift", isbn: "9780141439495", publicationYear: "1726" },
    { id: 23, title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", isbn: "9780374528379", publicationYear: "1880" },
    { id: 24, title: "The Count of Monte Cristo", author: "Alexandre Dumas", isbn: "9780141392462", publicationYear: "1844" },
    { id: 25, title: "Anna Karenina", author: "Leo Tolstoy", isbn: "9780143035008", publicationYear: "1877" }
];

const booksRoutes = (fastify, options, done) => {

    fastify.get("/books", (req, rep) => {
        return books
    })
    fastify.post("/books", postBookOpts, (req, rep) => {
        const { book } = req.body;
        books.push({ ...book, id: Date.now() })
        console.log(books);
        return "Success"
    })
    fastify.put("/books/:id", putBookOpts, (req, rep) => {
        const { book } = req.body;
        const id = parseInt(req.params.id)
        books = books.map(b => {
            if (b.id === id)
                return { ...b, ...book };
            return b
        })
        console.log(books);
        return "Success"
    })
    fastify.get("/books/:id", getBookOpts, (req, rep) => {
        const id = parseInt(req.params.id)
        const book = books.find(i => i.id === id)
        return book
    })

    fastify.get("/books/pagination/:page", getBookPaginatedOpts, (req, rep) => {
        const page = parseInt(req.params.page)
        const paginatedBooks = books.slice(page * 10, page * 10 + 10)
        return { books: paginatedBooks };
    })

    fastify.get("/books/filter", getFilteredBookOpts, (req, rep) => {
        const { author, publicationYear } = req.query;
        const filteredBooks = books.filter(i => {
            if (!publicationYear && !author) {
                return books
            }
            else if (publicationYear) {
                return i.author.includes(author || "") && i.publicationYear === publicationYear
            } else {
                return i.author.includes(author)
            }

        }
        )
        return filteredBooks
    })

    fastify.delete("/books/:id", getBookOpts, (req, rep) => {
        const id = parseInt(req.params.id)
        books = books.filter(i => i.id !== id)
        console.log(books);
        return books
    })

    done()
}

module.exports = {
    booksRoutes
}