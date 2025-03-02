const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const kullaniciSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
        unique: true,
        length: 15
    },
    isActive: {
        type: Boolean,
        default: true
    },
    email: {
        type: String
    },
    password: { type: String, },
    avatar: { type: Buffer },
    gender: { type: String, enum: ["Erkek", "Kadın"] },
    employment: { type: String },
    auth: {
        type: { type: String, enum: ["Own", "Customer"] },
        status: [{ type: String, enum: ["PublicRelations", "Finance", "Admin"] }],
        auths: {
            companyAuths: [{ company: { type: Schema.Types.ObjectId, ref: 'Firma' }, roles: [{ type: String, enum: ["Finance", "Personal", "Admin"] }] }],
            insuranceAuths: [{ insurance: { type: Schema.Types.ObjectId, ref: 'Sicil' }, roles: [{ type: String, enum: ["Personal", "Admin"] }] }],
        }
    },
    ui: { type: String, default: '' },
    /*register: { registerDate: { type: Date, default: Date.now }, registerBy: { type: Schema.Types.ObjectId, ref: 'Kullanici' } },
    updates: [{ updatedBy: { type: Schema.Types.ObjectId, ref: 'Kullanici' }, date: { type: Date, default: Date.now } }]*/
});

kullaniciSchema.pre('save', function (next) {
    if (this.password) {
        if (!this.isModified('password')) {
            return next()
        }

        bcrypt.hash(this.password, 10)
            .then(hash => {
                this.password = hash;
                next();
            });
    }
    else {
        return next()
    }
})

const Kullanici = mongoose.model('Kullanici', kullaniciSchema);

module.exports = Kullanici;