const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const cariSchema=new Schema({
    company:{
        type: Schema.Types.ObjectId, 
        ref: 'Firma',
        required:true
    },
    process: {
        type:String
    },    
    processDate:{
        type:Date
    },
    processNumber: {
        type:String
    },  
    collectType:{
        type:String
    },
    debt:{
        type:String
    },
    receive:{
        type:String
    },
    chequeDue:{
        type:Date
    },
    approvalStatus:{
        type: Boolean, 
        default:false
    },
    register:{olusturan:{type: Schema.Types.ObjectId, ref: 'Kullanici'}, date: {type:String},
    },
    updates:[{ degistiren:{type: Schema.Types.ObjectId, ref: 'Kullanici'}, date: {type:String},
       
    }]
});
const Cari=mongoose.model('Cari',cariSchema);

module.exports=Cari;