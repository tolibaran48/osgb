const auth = require("../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Assignment = {

    assignment: async (parent, args, { token,Assignment }) => {
        await auth(token);

        try {
            return await Assignment.findOne({ "insuranceControlNumber": args.insuranceControlNumber });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    assignments: async (parent, args, { token,Assignment }) => {
        await auth(token);
        
        try {
            return await Assignment.find();
        } catch (error) {
            throw new GraphQLError(error)
        }
    }

};

module.exports = Assignment;