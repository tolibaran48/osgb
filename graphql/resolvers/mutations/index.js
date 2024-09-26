const user = require('./user.mutation');
const company = require('./company.mutation');
const insurance = require('./insurance.mutation');
const person = require('./person.mutation');
const employee = require('./employee.mutation');
const concubine = require('./concubine.mutation');
const file = require('./file.mutation');
const waba = require('./waba.mutation');
const sms = require('./sms.mutation');

const Mutation = {
    ...user,
    ...company,
    ...insurance,
    ...person,
    ...employee,
    ...concubine,
    ...file,
    ...waba,
    ...sms
};

module.exports = Mutation;