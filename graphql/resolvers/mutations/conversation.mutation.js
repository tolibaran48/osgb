const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

module.exports = {
    createConversation: async (parent, args, { token, Conversation }) => {

        try {
            const { type, name, phone, e_mail, message, otpId } = args.data;


            return await new Conversation({
                type,
                name,
                phone,
                e_mail,
                message,
                otp: otpId
            }).save();

        } catch (error) {
            throw new GraphQLError(error)
        }

    },

};