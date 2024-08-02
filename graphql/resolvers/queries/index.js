const user = require('./userQuery');
const company = require('./companyQuery');
const insurance = require('./insuranceQuery');
const person = require('./personQuery');
const employee = require('./employeeQuery');
const assignment = require('./assignmentQuery');
const concubine = require('./concubineQuery');

const Query = {
    ...user,
    ...company,
    ...insurance,
    ...person,
    ...employee,
    ...assignment,
    ...concubine
};

module.exports = Query;