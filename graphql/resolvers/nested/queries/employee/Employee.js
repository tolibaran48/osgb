const auth = require("../../../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Employee={
    personObj:async(parent,args,{token,Person})=>{
        await auth(token);

        try {
           return await Person.findById(parent.person);
        } catch (error) {
            throw new GraphQLError(error)
        }       
    },
    insuranceObj:async(parent,args,{token,Sicil})=>{
        await auth(token);

        try {
           return await Sicil.findById(parent.insurance);
        } catch (error) {
             throw new GraphQLError(error)
        }       
    }
};

module.exports=Employee;