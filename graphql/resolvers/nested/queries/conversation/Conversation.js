const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Conversation = {
    otp: async (parent, args, { token, Otp }) => {
        //await auth(token);

        try {
            return await Otp.findById(parent.otp);
        } catch (error) {
            throw new GraphQLError(error)
        }
    }
};

module.exports = Conversation;