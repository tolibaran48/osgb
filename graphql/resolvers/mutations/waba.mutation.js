const auth = require("../../../helpers/auth");
const { GraphQLError } = require('graphql');
require('dotenv').config();
const axios = require('axios');

module.exports = {
    sendInvoice: async (parent, args, { token }) => {

        await auth(token);


        try {
            const { type, fileName, to, company, invoiceDate, invoiceAmount } = args.data

            await axios({
                "method": "POST",
                "url": `https://graph.facebook.com/v18.0/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
                "headers": {
                    Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
                },
                "data": {
                    "messaging_product": "whatsapp",
                    "to": `${to}`,
                    "recipient_type": "individual",
                    "type": "template",
                    "template": {
                        "namespace": "8ec9482f_8cc1_4966_b5cc_3b50713f54ca",
                        "name": "invoice_send",
                        "language": {
                            "code": "tr",
                            "policy": "deterministic"
                        },
                        "components": [
                            {
                                "type": "header",
                                "parameters": [
                                    {
                                        "type": "document",
                                        "document": {
                                            "filename": "AS1 Cari.pdf",
                                            "link": `https://yalikavak-358f781f0743.herokuapp.com/webhook/media/${type}/${fileName}/${token}`
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": `${company}`
                                    },
                                    {
                                        "type": "text",
                                        "text": `${invoiceDate}`
                                    },
                                    {
                                        "type": "currency",
                                        "currency": {
                                            "fallback_value": `${invoiceAmount}`,
                                            "code": "TRY",
                                            "amount_1000": `${invoiceAmount * 1000}`
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
            });

            return { "status": 200 }

        } catch (error) {
            throw new GraphQLError(error)
        }

    }
}