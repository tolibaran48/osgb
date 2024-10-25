const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wabaYetkiliSchema = new Schema({
    phoneNumber: {
        type: String,
        unique: true,
        length: 15
    },
    companyAuths: [{ type: Schema.Types.ObjectId, ref: 'Firma' }]
});


const WabaYetkili = mongoose.model('WabaYetkili', wabaYetkiliSchema);

module.exports = WabaYetkili;