const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');

const WabaUser = {
    companies: async (parent, args, { token, Firma }) => {
        await auth(token);

        try {
            const companies = await Firma.find({ "_id": { $in: parent.companyAuths } });

            return companies
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
};

module.exports = WabaUser;