const auth = require("../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Person = {
    person: async (parent, args, { token,Person }) => {
        await auth(token);

        try {
            return await Person.findOne({ "identityId": args.identityId });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    personById: async (parent, args, { token,Person }) => {
        await auth(token);
        
        try {
            return await Person.findById(args._id);
        } catch (error) {
            throw new GraphQLError(error)
        }
    }
};

module.exports = Person;