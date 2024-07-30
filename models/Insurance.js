const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sicilSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Firma',
        required: true
    },
    firmaGuid: { type: String },
    descriptiveName: {
        type: String,
        required: true,
        trim: true
    },
    isgKatipName: {
        type: String,
        trim: true,
        default: ''
    },
    insuranceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 34,
        maxlength: 34
    },
    insuranceControlNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    adress: {
        detail:{ type: String },
        il: { id:{type: Number},name:{type:String} },
        ilce: { id:{type: Number},name:{type:String}},
    },
    tehlikeSinifi: { type: String }, //, enum: ["Az Tehlikeli", "Tehlikeli", "Çok Tehlikeli"]
    employeeCount: { type: Number, default: 0 },
    workingStatus: {
        type: String,
        default: 'Aktif'
    },
    assignmentStatus: {
        uzmanStatus: {
            assignmentTotal: {
                type: Number,
                default: 0
            },
            approvalAssignments: [
                {
                    approvalStatus: {
                        type: String,
                        trim: true,
                    },
                    assignmentId: {
                        type: Number
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
                    assignmentTime: {
                        type: Number
                    },
                    startDate: {
                        type: String
                    },
                    endDate: {
                        type: String
                    }
                }
            ]
        },
        hekimStatus: {
            assignmentTotal: {
                type: Number,
                default: 0
            },
            approvalAssignments: [
                {
                    approvalStatus: {
                        type: String,
                        trim: true,
                    },
                    assignmentId: {
                        type: Number
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
                    assignmentTime: {
                        type: Number
                    },
                    startDate: {
                        type: String
                    },
                    endDate: {
                        type: String
                    }
                }
            ]
        },
        dspStatus: {
            assignmentTotal: {
                type: Number,
                default: 0
            },
            approvalAssignments: [
                {
                    approvalStatus: {
                        type: String,
                        trim: true,
                    },
                    assignmentId: {
                        type: Number
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
                    assignmentTime: {
                        type: Number
                    },
                    startDate: {
                        type: String
                    },
                    endDate: {
                        type: String
                    }
                }
            ]
        },

    },
    register: {
        degistiren: { type: Schema.Types.ObjectId, ref: 'Kullanici' }, date: { type: Date, default: Date.now },
        newInsurance:
        {
            descriptiveName: {
                type: String,
            }
            ,
            insuranceNumber: {
                type: String
            },
        },
    },
    updates: [{
        degistiren: { type: Schema.Types.ObjectId, ref: 'Kullanici' }, date: { type: Date, default: Date.now },
        newInsurance:
        {
            descriptiveName: {
                type: String
            }
            ,
            insuranceNumber: {
                type: String
            },
            workingStatus: {
                type: String,
                default: 'Aktif'
            },
        },
    }]
});
const Sicil = mongoose.model('Sicil', sicilSchema);

module.exports = Sicil;