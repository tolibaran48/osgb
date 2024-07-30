const auth = require("../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Employee = {
    employee: async (parent, args, { token,Employee }) => {
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
    employees: async (parent, args, { token,Employee }) => {
        await auth(token);
        
        try {
            return await Employee.find();
        } catch (error) {
            throw new GraphQLError(error)

        }

    }
};

module.exports = Employee;