const { hasAdminPremissions, hasUserPremissions } = require("../../middlewares/jwt");
const { getBookOpts, postBookOpts, putBookOpts, getBookOneOpts } = require("../../schema/v1/books");


const booksRoutes = (fastify, options, done) => {
    fastify.post('/books', postBookOpts, async (req, rep) => {
        const { book } = req.body;
        const client = await fastify.pg.connect();
        try {
            await hasAdminPremissions(req, rep)
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
            await hasAdminPremissions(req, rep)

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
            await hasUserPremissions(req, rep)

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
            await hasUserPremissions(request, reply)

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
            await hasAdminPremissions(req, rep)

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
