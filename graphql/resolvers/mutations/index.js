const user = require('./user.mutation');
const company = require('./company.mutation');
const insurance = require('./insurance.mutation');
const person = require('./person.mutation');
const employee = require('./employee.mutation');
const concubine = require('./concubine.mutation');
const waba = require('./waba.mutation');
const sms = require('./sms.mutation');
const wabaUser = require('./wabaUser.mutation');
const invoice = require('./invoice.mutation');
const otp = require('./otp.mutation');
const conversation = require('./conversation.mutation');

const Mutation = {
    ...user,
    ...company,
    ...insurance,
    ...person,
    ...employee,
    ...concubine,
    ...waba,
    ...wabaUser,
    ...sms,
    ...invoice,
    ...otp,
    ...conversation
};

module.exports = Mutation;