const { GraphQLError } = require("graphql");
const auth = require("../../../helpers/auth");

module.exports = {
    createWabaUser: async (parent, args, { token, WabaYetkili, Firma }) => {
        await auth(token);

        try {
            const { phoneNumber, companyAuths } = args.data;
            const company = await Firma.findOne({ "vergi.vergiNumarasi": companyAuths })

            if (!company) {
                console.log(`${companyAuths}  vergi numaralı firma bulunamadı`)
                return { "status": 404 }
            }

            const user = await WabaYetkili.findOne({ phoneNumber })

            if (user) {
                await WabaYetkili.findOneAndUpdate({ phoneNumber },
                    {
                        //$addToSet: { companyAuths: {$each: [ 2, 4 ] } } 
                        $addToSet: { companyAuths: company._id }
                    }, { upsert: true })
            }
            else {
                await new WabaYetkili({
                    phoneNumber,
                    companyAuths: [company._id]
                }).save();
            }

            return { "status": 404 }

        } catch (error) {
            console.log(error)
            throw new GraphQLError(error)
        }
    },
};