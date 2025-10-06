//Query resolvers
const Query = require('./queries/index');
const Firma = require('./nested/queries/company/Company');
const CompanyRegister = require('./nested/queries/company/CompanyRegister');
const CompanyUpdate = require('./nested/queries/company/CompanyUpdate');
const UserAuthCompany = require('./nested/queries/user/UserAuthCompany');
const UserAuthInsurance = require('./nested/queries/user/UserAuthInsurance');
const Sicil = require('./nested/queries/insurance/Insurance');
const InsuranceLocation = require('./nested/queries/insuranceLocation/InsuranceLocation');
const Employee = require('./nested/queries/employee/Employee');
const WabaYetkili = require('./nested/queries/waba/WabaUser');
const Cari = require('./nested/queries/concubine/Concubine');
const Conversation = require('./nested/queries/conversation/Conversation');

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
    InsuranceLocation,
    Employee,
    Cari,
    WabaYetkili,
    Conversation,
    Mutation,
    ...resolvers
};