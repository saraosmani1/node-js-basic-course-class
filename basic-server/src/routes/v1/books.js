const { bookSchema, getBookOpts, postBookOpts, putBookOpts, getBookOneOpts } = require("../../schema/v1/books");


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

    fastify.post('/books', postBookOpts, async (req, rep) => {
        const { book } = req.body;
        const client = await fastify.pg.connect();
        try {
            await client.query(
                'INSERT INTO books (title, author, publicationYear, isbn) VALUES ($1, $2, $3, $4)',
                [book.title, book.author, book.publicationYear, book.isbn]
            );
            return rep.send({ message: 'Book created successfully' });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });

    fastify.put('/books/:id', putBookOpts, async (req, rep) => {
        const { book } = req.body;
        const id = parseInt(req.params.id);
        const client = await fastify.pg.connect();
        try {
            const { rowCount } = await client.query(
                'UPDATE books SET title = $1, author = $2, publicationYear = $3, isbn = $4 WHERE id = $5',
                [book.title, book.author, book.publicationYear, book.isbn, id]
            );
            if (rowCount === 0) {
                return rep.status(404).send({ message: 'Book not found' });
            }
            return rep.send({ message: 'Book updated successfully' });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });
    fastify.get('/books/:id', getBookOneOpts, async (req, rep) => {
        const id = parseInt(req.params.id);
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query('SELECT * FROM books WHERE id = $1', [id]);
            if (rows.length === 0) {
                return rep.status(404).send({ message: 'Book not found' });
            }
            return rows[0];
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });

    fastify.get('/books', getBookOpts, async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { page, author, publicationYear, order } = request.query;

            let query = 'SELECT * FROM books';
            let conditions = [];
            let params = [];

            if (author) {
                conditions.push('author ILIKE $' + (params.length + 1));
                params.push(`%${author}%`);
            }
            if (publicationYear) {
                conditions.push('publicationYear = $' + (params.length + 1));
                params.push(publicationYear);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY publicationYear ' + (order === 'asc' ? 'ASC' : 'DESC');

            if (page) {
                const limit = 10;
                const offset = (parseInt(page) - 1) * limit;
                query += ` LIMIT ${limit} OFFSET ${offset}`;
            } else {
                query += ' LIMIT 10';
            }

            const { rows } = await client.query(query, params);
            reply.send(rows);
        } catch (err) {
            reply.send(err);
        } finally {
            client.release();
        }
    });


    fastify.delete('/books/:id', getBookOneOpts, async (req, rep) => {
        const id = parseInt(req.params.id);
        const client = await fastify.pg.connect();
        try {
            const { rowCount } = await client.query('DELETE FROM books WHERE id = $1', [id]);
            if (rowCount === 0) {
                return rep.status(404).send({ message: 'Book not found' });
            }
            return rep.send({ message: 'Book deleted successfully' });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });
    done()
}

module.exports = {
    booksRoutes
}
