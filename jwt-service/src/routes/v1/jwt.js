const { signInOpts, signUpOpts, } = require("../../schema/v1/jwt");


const jwtRoutes = (fastify, options, done) => {

    fastify.post('/signup', signUpOpts, async (req, rep) => {
        const { username, password, role } = req.body;
        const client = await fastify.pg.connect();
        try {
            await client.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
                [username, password, role]
            );

            const token = fastify.jwt.sign({ username, role })
            return rep.send({ token });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });

    fastify.post('/signin', signInOpts, async (req, rep) => {
        const { username, password } = req.body;
        const client = await fastify.pg.connect();
        try {
            const data = await client.query(
                'SELECT username, role FROM users WHERE username = $1 AND password = $2',
                [username, password]
            );
            console.log(data);
            const token = fastify.jwt.sign({ username, role })
            return rep.send({ token });
        } catch (err) {
            return rep.status(500).send({ message: 'An error occurred', error: err });
        } finally {
            client.release();
        }
    });
    done()
}

module.exports = {
    jwtRoutes
}
