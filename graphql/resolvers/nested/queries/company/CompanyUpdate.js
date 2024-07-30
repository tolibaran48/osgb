const auth = require("../../../../../helpers/auth");
const {GraphQLError } = require('graphql');

const CompanyUpdate={
    updatedBy:async(parent,args,{token,Kullanici})=>{
        await auth(token);

        try {
           return await Kullanici.findById(parent.updatedBy);
        } catch (error) {
             throw new GraphQLError(error)
        }       
    }
};

module.exports=CompanyUpdate;