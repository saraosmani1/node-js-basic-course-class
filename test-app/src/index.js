//const {Client} = require("pg");
const {generateFakeJwt} = require("./jwt-generator");

class MissingUsernameError extends Error {}
class MissingPasswordError extends Error {}
class DatabaseError extends Error {}

class UnAuthorizedError extends Error {}
class InternalServerError extends Error {}

class LoginService {
    constructor(pg) {
        this.pg = pg;
    }

    async getUser(username) {
        if (username === undefined || username === null) {
            throw new MissingUsernameError("Username not provided");
        }

        try {
            const res = await this.pg.query("SELECT * FROM users WHERE username=$1", [username]);

            return res.rows[0];
        } catch (e) {
            throw new DatabaseError("Database error", e);
        }
    }

    async verifyPassword(userId, password) {
        if (userId === undefined || userId === null) {
            throw new MissingUsernameError("UserId not provided");
        }

        if (password === undefined || password === null) {
            throw new MissingPasswordError("Password not provided");
        }

        try {
            const res = await this.pg.query("SELECT * FROM users WHERE id=$1 AND password=$2", [userId, password]);

            return res.rows[0] !== undefined ? true : false;
        } catch (e) {
            throw new DatabaseError("Database error", e);
        }
    }
}

class LoginRoute {
    constructor(loginService) {
        this.loginService = loginService;
    }

    // POST v1/login
    async login(username, password) {
        await this.loginService.pg.connect();

        const user = await this.loginService.getUser(username);

        if (user === undefined) {
            throw new UnAuthorizedError(`Invalid username`);
        }

        const isPasswordCorrect = await this.loginService.verifyPassword(user.id, password);

        if (isPasswordCorrect === false) {
            throw new UnAuthorizedError(`Invalid password`);
        }

        const token = generateFakeJwt(user);

        return {code: 200, body: {token}};
    }
}

module.exports = {LoginRoute, LoginService, UnAuthorizedError, InternalServerError, MissingUsernameError, MissingPasswordError, DatabaseError};
