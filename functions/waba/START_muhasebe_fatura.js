require("dotenv").config()
const axios = require('axios');
const WabaYetkili = require("../../models/WabaUser");
const createToken = require("../../helpers/token");

const START_muhasebe_fatura = async (phoneNumber) => {
    if (phoneNumber.length == 12) {
        phoneNumber = phoneNumber.substring(2)
    }
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
        url: `${process.env.LOCALHOST}/graphql`,
        method: 'post',
        headers: {
            "authorization": token
        },
        data: {
            query: `query{
               wabaUser(phoneNumber: "${phoneNumber}") {
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

    if (invoices.data.data.wabaUser) {
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
                        "text": "Fatura Formu"
                    },
                    "body": {
                        "text": "Faturalarınıza ulaşmak için  aşağıdaki *Fatura İndir* butonuna tıklayarak açılan formdan fatura seçimi yapın."
                    },
                    "action": {
                        "name": "flow",
                        "parameters": {
                            "flow_message_version": "3",
                            "flow_token": "2072737186496413",
                            "flow_name": "invoice_flow_v2",
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
    else {
        axios({
            "method": "POST",
            "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
            "headers": {
                Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
            },
            "data": {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": phoneNumber,
                "type": "text",
                "text": {
                    "body": "Yetkili olduğunuz firma bulunmamaktadır!"
                }
            }
        });
    }
}

module.exports = START_muhasebe_fatura;