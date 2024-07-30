const auth = require("../../../../../helpers/auth");
const {GraphQLError } = require('graphql');

const Insurance={
    companyObj:async(parent,args,{token,Firma})=>{
        await auth(token);

        try {
           return await Firma.findById(parent.company);
        } catch (error) {
            throw new GraphQLError(error)
        }       
    },
    companyObjName:async(parent,args,{token,Firma})=>{
        await auth(token);

        try {
           const company=await Firma.findById(parent.company);
           return company.name;
        } catch (error) {
            throw new GraphQLError(error)
        }       
    },
    employees:async(parent,args,{token,Employee})=>{
        await auth(token);
        
        try {
           return await Employee.find({ "insurance":parent._id});
        } catch (error) {
            throw new GraphQLError(error)
        }       
    },
};

module.exports=Insurance;