const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');

module.exports = {
    createCompany: async (parent, args, { token, Firma }) => {
        await auth(token);

        try {
            const { name, adress, vergi } = args.data;
            const company = await Firma.findOne({ "vergi.vergiNumarasi": vergi.vergiNumarasi })

            if (company) {
                throw new GraphQLError(`Bu vergi numarası ${company.name} adına kayıtlıdır!`, {
                    extensions: {
                        code: 'Kötü İstek',
                        status: 409,
                    },
                })
            }

            return await new Firma({
                name,
                adress,
                vergi,
                register: { registeredBy: "63d677b7d7d3597c4208d762", company: { name, adress, vergi } },
                updates: { updatedBy: "63d677b7d7d3597c4208d762", company: { name, adress, vergi } }
            }).save();

        } catch (error) {
            res.status(error.status).json({ msg: error.message })
        }

    },
    updateCompany: async (parent, args, { token, Firma, Sicil }) => {
        await auth(token);

        try {
            const { _id, name, adress, vergi, workingStatus } = args.data;

            const company = await Firma.findOne({ $and: [{ 'vergi.vergiNumarasi': vergi.vergiNumarasi }, { '_id': { $ne: _id } }] })

            if (company) {
                throw new GraphQLError(`Bu vergi numarası ${company.name} adına kayıtlıdır!`, {
                    extensions: {
                        code: 'Kötü İstek',
                        status: 409,
                    },
                })
            }

            if (workingStatus === 'Fesih') {
                const _company = await Firma.findOne({ '_id': _id })
                if (_company.workingStatus === 'Aktif') {
                    await Sicil.updateMany({ "company": _id }, { $set: { "workingStatus": 'Kapandı' } })
                }
            }

            return await Firma.findOneAndUpdate({ _id: _id },
                {
                    $set: { name, adress, vergi, workingStatus },
                    $push: { updates: { company: { name, adress, vergi, workingStatus }, updatedBy: "63d677b7d7d3597c4208d762" } }
                }, { new: true })

        } catch (error) {
            throw new GraphQLError(error)
        }

    }
};