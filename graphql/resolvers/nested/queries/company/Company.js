const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');
const dayjs = require('dayjs');

const Company = {
    auth: async (parent, args, { token, Kullanici }) => {
        await auth(token);

        try {
            return await Kullanici.find({ "auth.auths.companyAuths.company": parent._id });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    insurances: async (parent, args, { token, Sicil }) => {
        await auth(token);

        try {
            return await Sicil.find({ "company": parent._id }).sort({ "workingStatus": 1, "employeeCount": -1 });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    contacts: async (parent, args, { token, Kullanici }) => {
        await auth(token);

        try {
            return await Kullanici.find({ "auth.auths.companyAuths.company": parent._id });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    concubines: async (parent, args, { token, Cari }) => {
        await auth(token);

        try {
            return await Cari.find({ "company": parent._id }).sort({ "processDate": 1 });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    invoices: async (parent, args, { token, Cari }) => {
        await auth(token);

        const date = dayjs("01/03/2024", 'DD/MM/YYYY').format()

        try {
            return await Cari.find({ "company": parent._id, "process": "Fatura", "processDate": { $gte: date } }).sort({ "processDate": -1 });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    employees: async (parent, args, { token, Employee }) => {
        await auth(token);

        try {
            return await Employee.find({ "company": parent._id }).sort({ "name": 1 });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

};

module.exports = Company;