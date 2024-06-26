const { signInOpts, signUpOpts, tokenOpts, } = require("../../schema/v1/jwt");


const jwtRoutes = (fastify, options, done) => {

    fastify.post('/signup', signUpOpts, async (req, rep) => {
        const { user } = req.body;
        const client = await fastify.pg.connect();
        try {
            await client.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
                [user.username, user.password, user.role]
            );

            const token = fastify.jwt.sign({ username: user.username, role: user.role })
            return rep.send({ token });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });

    fastify.post('/signin', signInOpts, async (req, rep) => {
        const { user } = req.body;
        const client = await fastify.pg.connect();
        try {
            const {rows} = await client.query(
                'SELECT username, role FROM users WHERE username = $1 AND password = $2',
                [user.username, user.password]
            );
            const token = fastify.jwt.sign({ username:rows[0].username, role:rows[0].role })
            return rep.send({ token });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });
    fastify.post('/verify', tokenOpts, async (req, rep) => {
        const { token } = req.body;
        const client = await fastify.pg.connect();
        try {
            const decodedToken = fastify.jwt.verify(token);
            return rep.send({ role:decodedToken.role });
        } catch (err) {
                return rep.status(401).send({ message: 'Unauthorised' });
        } finally {
            client.release();
        }
    });
    done()
}

module.exports = {
    jwtRoutes
}
