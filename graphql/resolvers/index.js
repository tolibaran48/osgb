//Query resolvers
const Query = require('./queries/index');
const Firma = require('./nested/queries/company/Company');
const CompanyRegister = require('./nested/queries/company/CompanyRegister');
const CompanyUpdate = require('./nested/queries/company/CompanyUpdate');
const UserAuthCompany = require('./nested/queries/user/UserAuthCompany');
const UserAuthInsurance = require('./nested/queries/user/UserAuthInsurance');
const Sicil = require('./nested/queries/insurance/Insurance');
const Employee = require('./nested/queries/employee/Employee');
const WabaYetkili = require('./nested/queries/waba/WabaUser');

//Scalar resolvers
const { resolvers } = require("graphql-scalars");

//Mutation resolvers
const Mutation = require('./mutations/index');


module.exports = {
    Query,
    Firma,
    CompanyRegister,
    CompanyUpdate,
    UserAuthCompany,
    UserAuthInsurance,
    Sicil,
    Employee,
    WabaYetkili,
    Mutation,
    ...resolvers
};