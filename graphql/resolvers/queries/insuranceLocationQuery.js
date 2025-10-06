const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
require('dotenv').config();

const InsuranceLocation = {
    insuranceLocations: async (parent, args, { token, InsuranceLocation }) => {
        //await auth(token);

        try {
            return await InsuranceLocation.find();
        } catch (error) {
            throw new GraphQLError(error)

        }

    }
};

module.exports = InsuranceLocation;