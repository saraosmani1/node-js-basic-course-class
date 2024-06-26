const verifyToken = async (jwt) => {
    try {
        const response = await fetch("http://127.0.0.1:3001/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: jwt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error verifying token:", error);
    }
};


const checkActions = async (req, reply) => {
    const token = req.headers.token;
    let acts = []
    if (!token) {
        return reply.status(401).send({ message: 'Token is required' });
    }

    try {
        const data = await verifyToken(token);
        const { actions } = data;


        if (actions) {
            acts = actions
        }
        return acts
    } catch (error) {
        return reply.status(500).send({ message: 'Failed to verify token', error: error.message });
    }
};

const hasAdminPremissions = async (req, rep) => {
    const actions = await checkActions(req, rep)
    if (actions.length === 1) {
        return rep.status(403).send({ message: 'Forbidden:' });
    }
}

const hasUserPremissions = async (req, rep) => {
    const actions = await checkActions(req, rep)
    if (actions?.length > 1)
        return rep.status(403).send({ message: 'Forbidden:' });
}

module.exports = {
    checkActions,
    hasAdminPremissions,
    hasUserPremissions
}