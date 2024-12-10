require("dotenv").config()
const axios = require('axios');

const SEND_location = async (data) => {
    let phoneNumber = data.phoneNumber
    if (phoneNumber.length == 12) {
        phoneNumber = phoneNumber.substring(2)
    }

    await axios({
        "method": "POST",
        "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
        "headers": {
            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
        },
        "data": {
            "messaging_product": "whatsapp",
            "to": `${phoneNumber}`,
            "recipient_type": "individual",
            "type": "template",
            "template": {
                "namespace": "8ec9482f_8cc1_4966_b5cc_3b50713f54ca",
                "name": "send_location",
                "language": {
                    "code": "tr",
                    "policy": "deterministic"
                },
                "components": [
                    {
                        "type": "header",
                        "parameters": [
                            {
                                "type": "location",
                                "location": {
                                    "latitude": 37.10100000000,
                                    "longitude": 27.22900000000,
                                    "name": "BODRUM YALIKAVAK İŞÇİ SAĞLIĞI VE GÜVENLİĞİ HİZMETLERİ",
                                    "address": "Yalıkavak Merkez Mah. 6221.Sok. 11/1, 48990 Bodrum/Muğla"
                                }

                            }
                        ]
                    }
                ]
            }
        },
    });
}

module.exports = SEND_location;