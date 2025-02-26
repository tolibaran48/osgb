const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
const { createWriteStream, unlinkSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const mongoose = require('mongoose');
xml2js = require('xml2js');

var fs = require("fs");

module.exports = {
    uploadInvoice: async (parent, args, { token, Cari, Firma }) => {
        await auth(token);

        let invoices = []

        for (let invoice of args.data.invoices) {

            let company = await Firma.findOne({ "vergi.vergiNumarasi": invoice.vergiNumarasi });

            if (company) {
                await new Cari({
                    "company": company._id,
                    "process": invoice.process,
                    "processDate": invoice.processDate,
                    "debt": invoice.debt,
                    "processNumber": invoice.processNumber
                }).save()
            }
            else {
                invoices.push(invoice)
            }

        }

        return invoices

    },
}