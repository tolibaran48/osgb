require("dotenv").config()
const axios = require('axios');
const WabaYetkili = require("../../models/WabaUser");
const createToken = require("../../helpers/token");

const START_muhasebe_bakiye = async (phoneNumber) => {
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

    const _companies = await axios({
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

    if (_companies.data.data.wabaUser) {
        const companies = _companies.data.data.wabaUser.companies.map((company) => {
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
                        "text": "Cari dökümünüze ulaşmak için  aşağıdaki *Cari İndir butonuna tıklayarak açılan formdan personel seçimi yapın."
                    },
                    "action": {
                        "name": "flow",
                        "parameters": {
                            "flow_message_version": "3",
                            "flow_token": "1149163760100654",
                            "flow_name": "concubine_flow_v3 kopyası",
                            "flow_cta": "Cari indir",
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

module.exports = START_muhasebe_bakiye;