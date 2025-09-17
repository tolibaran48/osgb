const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const Employee = {
    employee: async (parent, args, { token, Employee }) => {
        await auth(token);

        try {
            return await Employee.findById(args._id);
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    employeeById: async (parent, args, { Employee }) => {
        await auth(token);

        try {
            return await Person.findById(args._id);
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    employees: async (parent, args, { token, Employee }) => {
        await auth(token);

        try {
            return await Employee.find();
        } catch (error) {
            throw new GraphQLError(error)

        }

    },
    getEmployeeFile: async (parent, args, { token, Employee }) => {
        await auth(token);

        try {
            const mediaToken = await jwt.sign({ type: args.type, fileName: `${args.fileName}.pdf` }, process.env.jwtSecret, { "expiresIn": 5 * 60 });
            return (mediaToken)
        } catch (error) {
            throw new GraphQLError(error)

        }

    }
};

module.exports = Employee;