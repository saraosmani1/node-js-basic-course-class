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
                        username: { type: 'string' },
                        role: { type: 'string' },
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





module.exports = {
    signUpOpts,
    signInOpts,
};
