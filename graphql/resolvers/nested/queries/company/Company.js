const auth = require("../../../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Company = {
    auth: async (parent, args, { token,Kullanici }) => {
        await auth(token);

        try {
            return await Kullanici.find({ "auth.auths.companyAuths.company":parent._id});
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    insurances: async (parent, args, { token,Sicil }) => {
        await auth(token);

        try {
            return await Sicil.find({ "company":parent._id}).sort({"workingStatus":1,"employeeCount":-1});
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    contacts: async (parent, args, { token,Kullanici }) => {
        await auth(token);
        
        try {
            return await Kullanici.find({ "auth.auths.companyAuths.company":parent._id});
        } catch (error) {
            throw new GraphQLError(error)
        }
    }

};

module.exports = Company;