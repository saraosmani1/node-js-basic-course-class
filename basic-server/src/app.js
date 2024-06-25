const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui")
const jwt = require("@fastify/jwt");
const { booksRoutes } = require("./routes/v1/books");

const build = (opts = {}, optsSwaggerUI = {}) => {
    const app = fastify(opts);
    app.register(fastifySwagger);
    app.register(fastifySwaggerUI, optsSwaggerUI)
    app.register(booksRoutes);




    return app;
};

module.exports = { build };