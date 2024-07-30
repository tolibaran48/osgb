const UserAuthInsurance={
    insurance:async(parent,args,{token,Sicil})=>{
        try {
           return await Sicil.findById(parent.insurance);
        } catch (error) {
            return error
        }       
    }
};

module.exports=UserAuthInsurance;