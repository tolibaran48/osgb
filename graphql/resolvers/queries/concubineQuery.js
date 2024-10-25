const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

const Concubine = {
    companyConcubines: async (parent, args, { token, Cari }) => {
        await auth(token);

        try {
            return Cari.aggregate([
                { $sort: { processDate: -1 } },
                {
                    $group: {
                        _id: '$company',
                        alacak: { "$sum": { $toDouble: "$debt" } },
                        borc: { "$sum": { $toDouble: "$receive" } },
                        tahsilatlar: {
                            $push:
                                { $cond: [{ $eq: ["$process", "Tahsilat"] }, { process: "$process", processDate: "$processDate", receive: { $convert: { input: "$receive", to: 'double' } } }, "$$REMOVE"] }
                        },
                        faturalar: {
                            $push:
                                { $cond: [{ $eq: ["$process", "Fatura"] }, { process: "$process", processDate: "$processDate", debt: { $convert: { input: "$debt", to: 'double' } } }, "$$REMOVE"] }
                        },

                        // mergedSales: { $mergeObjects:{$eq:["$cari.process","Tahsilat"]}}
                    }
                },
                { $addFields: { toplam: { $convert: { input: { $subtract: ['$alacak', '$borc'] }, to: 'double' } } } },
                //{ $addFields: { sonOdeme: { $max: "$tahsilatlar.processDate" } } },
                { $addFields: { sonOdeme: { $first: "$tahsilatlar" } } },
                //{ $addFields: { sonFatura: { $max: "$faturalar.processDate" } } },
                { $addFields: { sonFatura: { $first: "$faturalar" } } },
                { $addFields: { cariler: { $concatArrays: ["$faturalar", "$tahsilatlar"] } } },
                { $unset: ["faturalar", "tahsilatlar", "workingStatus"] },
                {
                    $lookup: {
                        from: 'firmas', localField: '_id', foreignField: '_id', as: 'firma'
                    }
                },
                { $unwind: "$firma" },
                { $addFields: { companyName: { name: "$firma.name", isgKatipName: "$firma.isgKatipName" } } },
                { $addFields: { vergiNumarasi: "$firma.vergi.vergiNumarasi" } },
                { $addFields: { workingStatus: "$firma.workingStatus" } },
                { $addFields: { vergiDairesi: "$firma.vergi.vergiDairesi" } },
                { $unset: ["firma"] },
                { $sort: { toplam: -1 } },

            ])
        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    invoiceLink: async (parent, args, { token }) => {
        await auth(token);

        try {
            return 'Fatura info çalıştı!';
        } catch (error) {
            throw new GraphQLError(error)
        }
    }
};

module.exports = Concubine;