const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Concubine = {
    company: async (parent, args, { token, Firma }) => {
        await auth(token);

        try {
            return await Firma.findById(parent.company);
        } catch (error) {
            throw new GraphQLError(error)
        }
    }
};

module.exports = Concubine;