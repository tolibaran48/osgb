require("dotenv").config()
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const auth = async (token) => {
    if (!token)
        throw new GraphQLError('Biletiniz yok, yetkilendirme reddedildi', {
            extensions: {
                code: 'Unauthorized',
                status: 401 ,
            },
        })

    try {
        
        return jwt.verify(token, process.env.jwtSecret);
    }
    catch(error)
    {
        throw new GraphQLError('Biletiniz geçersiz', {
            extensions: {                
                code: 'Unauthorized',
                status: 401,
            },
        })
    }

}

module.exports = auth;