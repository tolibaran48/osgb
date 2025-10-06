const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');

const InsuranceLocation = {
    insurance: async (parent, args, { token, Sicil }) => {
        //await auth(token);

        try {
            return await Sicil.findById(parent.insurance);
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
};

module.exports = InsuranceLocation;