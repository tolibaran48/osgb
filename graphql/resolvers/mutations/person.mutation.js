const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

module.exports={
    createPerson:async(parent,args,{token,Person})=>{
        await auth(token);

        try {
            const {name,surname,identityId}=args.data;

        return await new Person({
                name,
                surname,
                identityId,
        }).save();
            
        } catch (error) {
            throw new GraphQLError(error)
        }
    
    }
}