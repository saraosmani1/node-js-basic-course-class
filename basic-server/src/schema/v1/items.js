const bookSchema = {
    type: 'object',
    required: ['title', 'author', 'isbn', 'publicationYear'],
    properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        publicationYear: { type: 'string' }
    }
};

const postBookOpts = {
    schema: {
        tags: ['books'],
        body: {
            type: 'object',
            properties: {
                book: bookSchema
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    book: bookSchema
                }
            }
        }
    }
}
const putBookOpts = {
    schema: {
        tags: ['books'],
        body: {
            type: 'object',
            properties: {
                book: bookSchema
            }
        },
        params: {
            id: {
                type: "string"
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    book: bookSchema
                }
            }
        }
    }
}

module.exports ={
    postBookOpts,
    putBookOpts
}