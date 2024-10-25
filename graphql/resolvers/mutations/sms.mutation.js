const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
require('dotenv').config();
const axios = require('axios');
require("dotenv").config()

module.exports = {
    sendSMS: async (parent, args, { token }) => {
        await auth(token);

        try {
            const { phoneNumber, text } = args.data;

            const response = await axios({
                "method": "POST",
                "url": `http://www.postaguvercini.com/api_http/sendsms.asp?user=YALIKAVAKOSGB&password=Yosgb48!&gsm=${phoneNumber}&text=test`,
            });
            console.log(response)
            return { "status": 200 }

        } catch (error) {
            throw new GraphQLError(error)
        }
    }
}