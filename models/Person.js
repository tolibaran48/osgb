const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const personSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    identityId:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        enum: ["Erkek", "Kadın"]
    },
    maritalStatus:{
        type:String,
        enum: ["Evli", "Bekar"]
    }, 
    birthPlace:{
        type:String
    },
    birthDate:{
        type:Boolean,
        default:true
    },
    momName:{
        type:String,
    },
    fatherName:{
        type:String,
    },
    blood:{
        type:String,
        enum: [
            "A Rh(+)",
            "A Rh(-)",
            "B Rh(+)",
            "B Rh(-)",
            "AB Rh(+)",
            "AB Rh(-)",
            "0 Rh(+)",
            "0 Rh(+)",
        ]
    },
    childNumber:{
        type:Number,
    },
    avatar:{ 
        type:Buffer
    },    
});

const Person=mongoose.model('Person',personSchema);

module.exports=Person;