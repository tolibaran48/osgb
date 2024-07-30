const auth = require("../../../../../helpers/auth");
const {GraphQLError } = require('graphql');

const CompanyRegister={
    registeredBy:async(parent,args,{token,Kullanici})=>{
        await auth(token);
        
        try {
           return await Kullanici.findById(parent.registeredBy);
        } catch (error) {
            throw new GraphQLError(error)
        }       
    }
};

module.exports=CompanyRegister;