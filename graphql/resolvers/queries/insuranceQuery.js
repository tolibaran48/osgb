const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Sicil = {
    insurance: async (parent, args, { token, Sicil }) => {
        await auth(token);

        try {
            return await Sicil.findById(args._id);
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    insurances: async (parent, args, { token, Sicil }) => {
        console.log(token)
        await auth(token);

        return Sicil.aggregate([
            { $lookup: { from: 'firmas', localField: 'company', foreignField: '_id', as: 'firmalar' } },
            { $addFields: { companyName: { $first: "$firmalar.name" } } },
            { $addFields: { isgKatipName: { $first: "$firmalar.isgKatipName" } } },
            { $addFields: { ilce: "$adress.ilce.name" } },
            { $unset: ["firmalar", "updates", "register"] },
            { $sort: { "workingStatus": 1, "companyName": 1 } }
        ]);
    },
};

module.exports = Sicil;