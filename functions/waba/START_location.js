require("dotenv").config()
const axios = require('axios');

const START_location = async (phoneNumber) => {
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
                "name": "start_select_location",
                "language": {
                    "code": "tr",
                    "policy": "deterministic"
                }
            }
        },
    });
}

module.exports = START_location;