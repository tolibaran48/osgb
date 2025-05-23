const auth = require("../../../helpers/auth");
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    sendInvoice: async (parent, args, { token }) => {
        await auth(token);

        const mediaToken = jwt.sign({ type: args.data.type, fileName: `${args.data.fileName}.pdf` }, process.env.jwtSecret, { "expiresIn": 5 * 60 });

        const Path = path.join(__dirname, '../../../faturalar');

        if (!fs.existsSync(Path)) {
            fs.mkdirSync(Path, { recursive: true });
        }

        try {
            const { to, company, invoiceDate, invoiceAmount, fileName } = args.data

            await axios({
                "method": "POST",
                "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
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
                                            "filename": `${fileName}.pdf`,
                                            "link": `https://www.yalikavakosgb.com/webhook/media/${mediaToken}`
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
            throw new GraphQError(error)
        }

    },
    sendEmployeeDocument: async (parent, args, { token }) => {
        await auth(token);

        const mediaToken = await jwt.sign({ type: args.data.type, fileName: `${args.data.fileName}.pdf` }, process.env.jwtSecret, { "expiresIn": 5 * 60 });

        try {
            const { to, namesurname, identityId, fileName, type, companyName } = args.data

            await axios({
                "method": "POST",
                "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
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
                        "name": "personel_evrak",
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
                                            "filename": `${fileName}.pdf`,
                                            "link": `https://www.yalikavakosgb.com/webhook/media/${mediaToken}`
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": `${companyName}`
                                    },
                                    {
                                        "type": "text",
                                        "text": `${identityId}`
                                    },
                                    {
                                        "type": "text",
                                        "text": `${namesurname}`
                                    }
                                ]
                            }
                        ]
                    }
                },
            });
            return { "status": 200 }

        } catch (error) {
            console.log(error)
            throw new GraphQLError(error)
        }

    }
}