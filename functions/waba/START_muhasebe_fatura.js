require("dotenv").config()
const axios = require('axios');
const WabaYetkili = require("../../models/WabaUser");
const createToken = require("../../helpers/token");

const START_muhasebe_fatura = async (phoneNumber) => {

    const yetki = await WabaYetkili.find({ phoneNumber })

    if (!yetki) {
        throw new GraphQLError('Kullanıcı adı veya parola yanlıştır.', {
            extensions: {
                code: 'Unauthorized',
                status: 401,
            },
        })
    }

    const token = await createToken.generate({ phoneNumber }, '5m');

    const invoices = await axios({
        url: 'http://localhost:4000/graphql',
        method: 'post',
        headers: {
            "authorization": token
        },
        data: {
            query: `query{
               wabaUser(phoneNumber: "5357258166") {
                 phoneNumber
                 companies {
                   name
                   vergi {
                   vergiNumarasi
                 }     
               }
             }
           }`
        }
    })

    const companies = invoices.data.data.wabaUser.companies.map((company) => {
        return { "id": company.vergi.vergiNumarasi, "title": company.name, "description": "" }
    })

    axios({
        "method": "POST",
        "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
        "headers": {
            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
        },
        "data": {
            "recipient_type": "individual",
            "messaging_product": "whatsapp",
            "to": phoneNumber,
            "type": "interactive",
            "interactive": {
                "type": "flow",
                "header": {
                    "type": "text",
                    "text": "Flow message header"
                },
                "body": {
                    "text": "Flow message body"
                },
                "footer": {
                    "text": "Flow message footer"
                },
                "action": {
                    "name": "flow",
                    "parameters": {
                        "flow_message_version": "3",
                        "flow_token": "1282243802768507",
                        "flow_name": "invoice_flow_v0",
                        "flow_cta": "Fatura indir",
                        "flow_action_payload": {
                            "screen": "COMPANY",
                            "data": { companies, phoneNumber }
                        }
                    }
                }
            }
        }
    });



}

module.exports = START_muhasebe_fatura;