const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    insuranceControlNumber:{
        type: String,
        required: true,
        trim: true
    },
    assignments:[
        {
            assignmentId: {
                type: Number
            },
            startDate: {
                type: String
            },
            endDate: {
                type: String
            },
            identificationDate: {
                type: String
            },
            profApprovalStatus: {
                type: String,
                trim: true,
            },
            companyApprovalStatus: {
                type: String,
                trim: true,
            },          
            identityId: {
                type: String
            },
            nameSurname: {
                type: String
            },
            category: {
                type: String
            },
            workingStatus: {
                type: String
            },  
            workingApproveStatus: {
                type: String
            },
            assignmentTime: {
                type: Number
            },
            certificateNumber: {
                type: String
            },
            isgKatipName: {
                type:String
            },
            tehlikeSinifi: {
                type:String
            },
            insuranceControlNumber: {
                type:String
            },
            employeeCount: {
                type:Number
            }
        }
    ]
});
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;