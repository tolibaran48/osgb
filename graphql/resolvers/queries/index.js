const user = require('./userQuery');
const company = require('./companyQuery');
const insurance = require('./insuranceQuery');
const insuranceLocation = require('./insuranceLocationQuery');
const person = require('./personQuery');
const employee = require('./employeeQuery');
const assignment = require('./assignmentQuery');
const concubine = require('./concubineQuery');
const wabaUser = require('./wabaUserQuery');

const Query = {
    ...user,
    ...company,
    ...insurance,
    ...insuranceLocation,
    ...person,
    ...employee,
    ...assignment,
    ...concubine,
    ...wabaUser
};

module.exports = Query;