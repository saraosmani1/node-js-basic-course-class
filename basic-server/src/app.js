const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui")
const jwt = require("@fastify/jwt");
const { booksRoutes } = require("./routes/v1/books");
const fastifyPostgres = require("@fastify/postgres")
require('dotenv').config();

const connString = process.env.CONNECTION_STRING

const build = (opts = {}, optsSwaggerUI = {}) => {
    const app = fastify(opts);
    app.register(fastifySwagger);
    app.register(fastifySwaggerUI, optsSwaggerUI)
    app.register(booksRoutes);
    app.register(fastifyPostgres, {
        connectionString: connString
    })



    return app;
};

module.exports = { build };