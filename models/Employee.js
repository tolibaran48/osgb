const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Firma',
        required: true
    },
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Sicil'
    },
    workingStatus: {
        type: String,
        enum: ["Aktif", "Ayrıldı"]
    },
    entryDate: {
        type: Date,
    },
    relaseDate: {
        type: Date,
    },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;