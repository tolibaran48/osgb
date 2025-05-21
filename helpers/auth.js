require("dotenv").config()
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const auth = async (token) => {
    try {
        if (!token || token === 'null') {
            throw new GraphQLError('Biletiniz yok, yetkilendirme reddedildi', {
                extensions: {
                    code: 'Yetkisiz Giriş',
                    status: 401,
                },
            })
        }

        return jwt.verify(token, process.env.jwtSecret);
    }
    catch (error) {
        throw new GraphQLError(error.message, {
            extensions: {
                code: 'Yetkisiz Giriş',
                status: 401,
            },
        })
    }

}

module.exports = auth;