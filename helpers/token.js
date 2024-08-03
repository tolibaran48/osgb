const jwt = require('jsonwebtoken');
require("dotenv").config()

const createToken = {
    generate: ({ email }, expiresIn) => {
        return jwt.sign({ email }, process.env.jwtSecret, { expiresIn });
    }
}

module.exports = createToken;