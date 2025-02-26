const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Firma = {
    company: async (parent, args, { token, Firma }) => {
        await auth(token);
        console.log(token)

        try {
            return await Firma.findOne({ "vergi.vergiNumarasi": args.vergiNumarasi });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    companyById: async (parent, args, { token, Firma }) => {
        await auth(token);
        console.log(token)
        try {
            return await Firma.findById(args._id);
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    companies: async (parent, args, { token, Firma }) => {
        await auth(token);
        console.log(token)
        try {
            return await Firma.find().sort({ "workingStatus": 1, "name": 1 });
        } catch (error) {
            throw new GraphQLError(error)
        }

    }
};

module.exports = Firma;