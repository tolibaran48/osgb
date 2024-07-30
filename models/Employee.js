const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const employeeSchema=new Schema({
    person:{
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    insurance:{
        type: Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true
    },
    workingStatus:{
        type:String,
        enum: ["Aktif","Ayrıldı"]
    },
    entryDate:{
        type:Date,
    },
    relaseDate:{
        type:Date,
    },   
});

const Employee=mongoose.model('Employee',employeeSchema);

module.exports=Employee;