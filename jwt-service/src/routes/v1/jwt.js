const { signInOpts, signUpOpts, tokenOpts, } = require("../../schema/v1/jwt");


const jwtRoutes = (fastify, options, done) => {

    fastify.post('/signup', signUpOpts, async (req, rep) => {
        const { user } = req.body;
        const client = await fastify.pg.connect();
        try {
            let actions = ['read']
            if (user.role === 'admin') {
                actions.push('delete')
                actions.push('write')
            }
            await client.query(
                'INSERT INTO users (username, password, role, actions) VALUES ($1, $2, $3, $4)',
                [user.username, user.password, user.role, actions]
            );
            const token = fastify.jwt.sign({ username: user.username, role: user.role, actions })
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
            const { rows } = await client.query(
                'SELECT username, role, actions FROM users WHERE username = $1 AND password = $2',
                [user.username, user.password]
            );
            console.log(rows)
            const token = fastify.jwt.sign({ username: rows[0].username, actions: rows[0].actions, role: rows[0].role })
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
            console.log(decodedToken)
            return rep.send({ actions: decodedToken.actions });
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
