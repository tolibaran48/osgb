const auth = require("../../../helpers/auth");
require('dotenv').config();
const { GraphQLError } = require('graphql');
const { parse, join } = require("path");
const { createWriteStream } = require("fs");
const invoiceURL = process.env.invoiceURI;
const dayjs = require('dayjs');

module.exports = {
    createCollect: async (parent, args, { token, Firma, Cari }) => {
        //let user=await auth(token);

        try {
            const { company, process, processDate, processNumber, collectType, chequeDue, receive } = args.data;
            const result = await new Cari({
                company,
                process,
                processDate,
                processNumber,
                collectType,
                chequeDue,
                receive,
            }).save();

            return result;

        } catch (error) {
            throw new GraphQLError(error)
        }
    },
    invoiceUpload: async (parent, args, { token }) => {
        //await auth(token);
        let { filename, createReadStream } = await args.data
        let stream = createReadStream()

        let { ext, name } = parse(filename)
        name = name.replace(/([^a-z0-9]+)/gi, '-').replace(' ', '_')

        let invoiceFiles = join((__dirname, `../../../invoices/${name}${ext}`))
        let writeStream = await createWriteStream(invoiceFiles)
        await stream.pipe(writeStream)

        invoiceFiles = `${invoiceURL}${invoiceFiles.split('invoices')[1]}`

        return invoiceFiles
    },
    changeInvoice: async (parent, args, { token, Firma, Cari }) => {
        //let user=await auth(token);

        try {
            const { aliciAdi, faturaNumarasi, faturaTarihi, tutar } = args.data;
            const number = parseFloat(faturaNumarasi.split("2024")[1]).toString()

            const cari = await Cari.find({ "debt": tutar, "processDate": faturaTarihi, "process": "Fatura", "processNumber": number }).limit(10)

            if (cari.length > 1 || cari.length < 1) {
                console.log({ "length": cari.length, "fatura": number })
            }
            else {
                await Cari.findOneAndUpdate({ _id: cari[0]._id }, { $set: { processNumber: faturaNumarasi } }, { new: true })
            }

            return { "status": 200 }

        } catch (error) {
            throw new GraphQLError(error)
        }

    },
}