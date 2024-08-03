require("dotenv").config()
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const mediaAuth = async (token) => {
    try {
        return jwt.verify(token, process.env.mediaJwtSecret);
    }
    catch (error) {
        throw new GraphQLError('Biletiniz geçersiz', {
            extensions: {
                code: 'Unauthorized',
                status: 401,
            },
        })
    }

}

module.exports = mediaAuth;