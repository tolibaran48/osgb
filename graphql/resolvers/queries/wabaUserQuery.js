const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

const WabaYetkili = {
    wabaUser: async (parent, args, { token, WabaYetkili }) => {
        await auth(token);

        try {
            return await WabaYetkili.findOne({ "phoneNumber": args.phoneNumber });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
};

module.exports = WabaYetkili;