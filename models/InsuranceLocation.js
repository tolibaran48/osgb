
const mongoose = require('mongoose');
const { Float } = require('type-graphql');
const Schema = mongoose.Schema;

let insuranceLocationSchema = new Schema({
    insurance: {
        type: Schema.Types.ObjectId,
        ref: 'Sicil',
        //required: true
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: []
    }

});

insuranceLocationSchema.index({ location: '2dsphere' });
//console.log(insuranceLocationSchema.indexes())

const InsuranceLocation = mongoose.model('InsuranceLocation', insuranceLocationSchema);

module.exports = InsuranceLocation;