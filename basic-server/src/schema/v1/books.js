const getBookOpts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    author: { type: "string" },
                    title: { type: "string" },
                    isbn: { type: "string" },
                    publicationYear: { type: "string" }
                }
            }
        }
    }
};
const getBookPaginatedOpts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    books: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                author: { type: "string" },
                                title: { type: "string" },
                                isbn: { type: "string" },
                                publicationYear: { type: "string" }
                            }
                        }
                    }
                }
            }
        }
    }
};


const getFilteredBookOpts = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                author: { type: 'string' },
                publicationYear: { type: 'string' },
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
                        publicationYear: { type: "string" }
                    }
                }
            }
        }
    }
};

module.exports = { getBookOpts, getFilteredBookOpts, getBookPaginatedOpts };
