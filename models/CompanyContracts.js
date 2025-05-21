const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Firma'
    },
    contractStartDate: {
        type: Date,
    },
    contractEndDate: {
        type: Date,
    },
    contractPaymentType: {
        type: String,
        enum: ["Yillik", "Aylik"]
    },
    contractStatus: {
        type: String,
        enum: ["Devam Ediyor", "Geçersiz"]
    },
    monthlyContractType: {
        type: String,
        enum: ["Fix", "Kisi basi", "Opsiyonlu"]
    },
    KDV: {
        type: String,
        enum: ["KDV dahil", "KDV hariç"]
    },
    optionContractConditions: [
        {
            type: {
                type: String,
                enum: ["küçükse ve/veya eşitse", "arasında", "büyükse"]
            },
            option: {
                type: String,
                enum: ["Kişi Başı", "Fix"]
            },
            count1: {
                type: Number
            },
            count2: {
                type: Number
            },
            KDV: {
                type: String,
                enum: ["KDV dahil", "KDV hariç"]
            },
            price: {
                type: String,
            }
        }
    ],
    PaymentAmount: {
        type: String,
    }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;