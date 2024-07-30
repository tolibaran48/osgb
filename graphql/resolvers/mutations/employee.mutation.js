const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

module.exports={
    createEmployee:async(parent,args,{token,Employee})=>{
        await auth(token);

        console.log(Date.parse(args.data.entryDate))
        try {
            const {person,insurance,entryDate}=args.data;

        return await new Employee({
                person,
                insurance,
                entryDate:Date.parse(entryDate),
        }).save();
            
        } catch (error) {
            throw new GraphQLError(error)
        }
    
    }
}