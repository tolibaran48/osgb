const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const decryptRequest = require('../../functions/waba/decryptRequest');
const encryptResponse = require('../../functions/waba/encryptResponse');
const dayjs = require('dayjs');
const createToken = require('../../helpers/token');
require('dotenv').config();

router.post("/", async ({ body }, res) => {
    let privateFile = path.resolve('./functions/waba/files/private.pem')
    let PRIVATE_KEY = fs.readFileSync(privateFile, 'utf8');
    const { decryptedBody, aesKeyBuffer, initialVectorBuffer } = await decryptRequest(
        body,
        PRIVATE_KEY,
    );

    const screenData = await getNext(decryptedBody)

    // Return the response as plaintext
    const _response = await encryptResponse(screenData, aesKeyBuffer, initialVectorBuffer)
    res.send(_response);
});

const getNext = async (decryptedBody) => {

    const { screen, data, version, action } = decryptedBody;
    // Return the next screen & data to the client  
    console.log(decryptedBody)

    if (action === "ping") {
        return {
            data: {
                status: "active",
            },
        };
    }

    if (data?.error) {
        console.warn("Received client error:", data);
        return {
            data: {
                acknowledged: true,
            },
        };
    }

    const token = await createToken.generate({ email: process.env.wabaTokenMail }, '5m');

    if (action === "data_exchange") {
        switch (screen) {
            case "COMPANY":
                const _invoices = await axios({
                    url: 'http://localhost:4000/graphql',
                    method: 'post',
                    headers: {
                        "authorization": token
                    },
                    data: {
                        query: `query{
                          company(vergiNumarasi: "${data.company}") {
                              invoices {
                                processDate
                                debt
                                processNumber
                              }
                          }
                        }`
                    }
                })

                const invoices = _invoices.data.data.company.invoices.map((invoice) => {
                    return { "id": invoice.processNumber, "title": dayjs(invoice.processDate).format("DD/MM/YYYY"), "description": invoice.processNumber, "metadata": `${invoice.debt} TL` }
                })

                return {
                    screen: 'INVOICE',
                    data: invoices,
                };

            case "INVOICE":
                const phoneNumber = data.phoneNumber
                const invoice = data.invoice

                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {
                        extension_message_response: {
                            params: {
                                "flow_token": decryptedBody.flow_token,
                            },
                        },
                    },
                };

            default:
                break;
        }
    }

    console.error("Unhandled request body:", decryptedBody);
    throw new Error(
        "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
    );

}

module.exports = router;