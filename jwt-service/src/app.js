const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui")
const { jwtRoutes } = require("./routes/v1/jwt");
const fastifyPostgres = require("@fastify/postgres")
const fastifyJwt = require("@fastify/jwt")
require('dotenv').config();

const connString = process.env.CONNECTION_STRING
const jwtSecret = process.env.JWT_SECRET
const build = (opts = {}, optsSwaggerUI = {}) => {
    const app = fastify(opts);
    app.register(fastifySwagger);
    app.register(fastifySwaggerUI, optsSwaggerUI)
    app.register(jwtRoutes);

    app.register(fastifyPostgres, {
        connectionString: connString
    });

    app.register(fastifyJwt, {
        secret: jwtSecret
    })



    return app;
};

module.exports = { build };