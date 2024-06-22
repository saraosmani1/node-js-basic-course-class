function generateFakeJwt(user) {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const payload = {
        iat: new Date().getTime(),
        username: user.username,
    };

    return {header, payload};
}

module.exports.generateFakeJwt = generateFakeJwt;
