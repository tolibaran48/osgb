const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const firmaSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    firmaGuid:{type:String},
    isgKatipName: {
        type: String,
        trim: true,
        default: ''
    },
    adress: {
        type:String,
        trim:true,
    },
    vergi: {
        vergiDairesi:{ 
            type:String,
            trim:true,
            required:true,},
        vergiNumarasi:{ 
            type:String,
            trim:true,
            required:true,
            unique:true,
            minlength:10,
            maxlength:11}
    },
    workingStatus:{
        type:String,
        default:'Aktif'
    },
    register:{registeredBy:
        {type:Schema.Types.ObjectId, ref:'Kullanici'},date:{type:Date,default:Date.now},company:{
            name:{
                type:String,
                required:true,
                trim:true,
            },
            firmaGuid:{type:String},
            adress: {
                type:String,
                trim:true,
            },
            vergi: {
                vergiDairesi:{ 
                    type:String,
                    trim:true,
                    required:true,},
                vergiNumarasi:{ 
                    type:String,
                    trim:true,
                    required:true,
                    minlength:10,
                    maxlength:11}
            },
            workingStatus:{
                type:String,
                default:'Aktif'
            }
        }},
    updates:[{updatedBy:
        {type:Schema.Types.ObjectId, ref:'Kullanici'},date:{type:Date,default:Date.now},company:{
            name:{
                type:String,
                required:true,
                trim:true,
            },
            firmaGuid:{type:String},
            adress: {
                type:String,
                trim:true,
            },
            vergi: {
                vergiDairesi:{ 
                    type:String,
                    trim:true,
                    required:true,},
                vergiNumarasi:{ 
                    type:String,
                    trim:true,
                    required:true,
                    minlength:10,
                    maxlength:11}
            },
            workingStatus:{
                type:String,
                default:'Aktif'
            }
        }}]
  
});

const Firma=mongoose.model('Firma',firmaSchema);

module.exports=Firma;