require("dotenv").config()
const axios = require('axios');

const send_PersonelEvrak = async () => {
    const response = await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
        headers: {
            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
        },
        "data": {
            "messaging_product": "whatsapp",
            "to": `5494191961`,
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
                        "type": "button",
                        "sub_type": "flow",
                        "index": "0"
                    },
                ]
            }
        },
    });
    return response
}

module.exports = send_PersonelEvrak;