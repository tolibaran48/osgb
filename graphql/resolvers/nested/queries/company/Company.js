const auth = require("../../../../../helpers/auth");
const { GraphQLError } = require('graphql');
const dayjs = require('dayjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const Company = {
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
            return await Employee.find({ "company": parent._id }).sort({ "name": 1 })

        } catch (error) {
            throw new GraphQLError(error)
        }
    },

    employees: async (parent, args, { token, Employee }) => {
        await auth(token);

        try {
            let employees = await Employee.find({ "company": parent._id }).sort({ "name": 1 }).populate('person')

            function returnPromise() {
                return new Promise(function (resolve, reject) {
                    let arrays = employees.map(async (employee) => {
                        return {
                            '_id': employee._id,
                            'person': employee.person._id,
                            'company': employee.company,
                            'processTime': employee.processTime,
                            'fileLink': await jwt.sign({ type: `employeeFiles/${parent.vergi.vergiNumarasi}`, fileName: `${employee.person.identityId}-${employee.person.name} ${employee.person.surname}.pdf` }, process.env.jwtSecret, { "expiresIn": 20 * 60 })
                        }
                    })

                    Promise.all(arrays).then(function (results) {
                        resolve(results)
                    }).catch(err => console.log(err))
                });
            }

            return returnPromise()

        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    contracts: async (parent, args, { token, Contract }) => {
        await auth(token);

        try {
            return await Contract.find({ "company": parent._id }).sort({ "contractStatus": 1 });
        } catch (error) {
            throw new GraphQLError(error)
        }
    },

};

module.exports = Company;