const jwt=require('jsonwebtoken');

 const createToken = {
    generate: ({ email }, expiresIn) => {
        return jwt.sign({email}, process.env.jwtSecret, {expiresIn});
    }
}

module.exports=createToken;