const signInOpts = {
    schema: {
        tags: ['users'],
        body: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' },
                    }
                }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
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
const signUpOpts = {
    schema: {
        tags: ['users'],
        body: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    required: ['username', 'role', "password"],
                    properties: {
                        username: { type: 'string', minLength: 3, maxLength: 30 },
                        password: { type: 'string', minLength: 8, maxLength: 30 },
                        role: { type: 'string', enum: ['normal', 'admin'] },
                    }
                }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
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

const tokenOpts = {
    schema: {
        tags: ['token'],
        body: {
            type: 'object',
            required: ['token'],
            properties: {
                token: { type: 'string' },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    actions: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            },
            401: {
                type: 'object',
                properties: {
                    message: { type: 'string' }
                }
            }
        }
    }
}



module.exports = {
    signUpOpts,
    signInOpts,
    tokenOpts
};
