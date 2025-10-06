const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dayjs = require('dayjs');
require('dayjs/locale/tr');
dayjs.locale('tr')
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('tr')


const otpSchema = new Schema({
    type: {
        type: String,
        enum: ['System', 'iletisim'],
        required: true,
        default: 'iletisim'
    },
    phone: {
        type: String,
        //unique: true,
        // length: 15,
    },
    hash: {
        type: String,
        unique: true,
    },
    tryCount: {
        type: Number,
        default: 3,
    },
    registerDate: { type: Date, default: () => { return dayjs(new Date()) } },
    status: {
        type: String,
        enum: ['Active', 'Aborted'],
        required: true,
        default: 'Active',
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;