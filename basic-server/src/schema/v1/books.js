const getBookOpts = {
    schema: {
        headers: { type: 'object', properties: { 'token': { type: 'string' } }},
        querystring: {
            type: 'object',
            properties: {
                author: { type: 'string' },
                publicationYear: { type: 'string' },
                page: { type: 'string' },
                order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
            },
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        author: { type: "string" },
                        title: { type: "string" },
                        isbn: { type: "string" },
                        publicationyear: { type: "string", alias: 'publicationYear' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
};

const getBookOneOpts = {
    schema: {
        headers: { type: 'object', properties: { 'token': { type: 'string' } }},
        params: {
            id: {
                type: "string"
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    author: { type: "string" },
                    title: { type: "string" },
                    isbn: { type: "string" },
                    publicationYear: { type: "string" }
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }
};

const bookSchema = {
    type: 'object',
    required: ['title', 'author', 'isbn', 'publicationYear'],
    properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string', pattern: '^(97(8|9))?\\d{9}(\\d|X)$' }, // ISBN-10 and ISBN-13
        publicationYear: { type: 'string', maximum: new Date().getFullYear() }
    }
};

const postBookOpts = {
    schema: {
        headers: { type: 'object', properties: { 'token': { type: 'string' } }},
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
            },
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}
const putBookOpts = {
    schema: {
        headers: { type: 'object', properties: { 'token': { type: 'string' } }},
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
            },
            404: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}





module.exports = {
    bookSchema,
    postBookOpts,
    putBookOpts,
    getBookOpts,
    getBookOneOpts
};
