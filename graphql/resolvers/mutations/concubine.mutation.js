const auth = require("../../../helpers/auth");
require('dotenv').config();
const { GraphQLError } = require('graphql');
const {parse,join}=require("path");
const {createWriteStream}=require("fs");
const invoiceURL=process.env.invoiceURI;

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
            console.log(error)
            throw new GraphQLError(error)
        }

    },
    invoiceUpload: async (parent, args, { token }) => {
        //await auth(token);

        console.log('burada')
        console.log(args)
        let { filename, createReadStream } = await args.data
        let stream = createReadStream()

        let {ext,name}=parse(filename)
        name=name.replace(/([^a-z0-9]+)/gi, '-').replace(' ','_')

        let invoiceFiles=join((__dirname,`../../../invoices/${name}${ext}`))
        let writeStream=await createWriteStream(invoiceFiles)
        await stream.pipe(writeStream)

        invoiceFiles=`${invoiceURL}${invoiceFiles.split('invoices')[1]}`

        return invoiceFiles
    }
}