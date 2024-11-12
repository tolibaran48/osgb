const router = require('express').Router();
const axios = require('axios');
const { writeFile, readFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const decryptRequest = require('../../functions/waba/decryptRequest');
const encryptResponse = require('../../functions/waba/encryptResponse');
const dayjs = require('dayjs');
const createToken = require('../../helpers/token');
const _ = require('lodash');
require('dotenv').config();
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

router.post("/", async ({ body }, res) => {
    let privateFile = path.resolve('./functions/waba/files/private.pem')
    let PRIVATE_KEY = readFileSync(privateFile, 'utf8');
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
    const token = await createToken.generate({ email: process.env.wabaTokenMail }, '5m');

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



    if (action === "data_exchange") {
        switch (screen) {
            case "COMPANY":

                let now = dayjs(new Date())

                let endDate_initValue = dayjs(now).format("YYYY-MM-DD");
                let endDate_maxValue = dayjs(now).format("YYYY-MM-DD");
                let endDate_minValue = dayjs(now.subtract(2, 'year')).format("YYYY-MM-DD");

                let startDate_initValue = dayjs(now.subtract(1, 'year')).format("YYYY-MM-DD");
                let startDate_maxValue = dayjs(now.subtract(1, 'month')).format("YYYY-MM-DD");
                let startDate_minValue = dayjs(now.subtract(3, 'year')).format("YYYY-MM-DD");

                return {
                    screen: 'CONCUBINE',
                    data: {
                        endDate: {
                            initValue: endDate_initValue,
                            minDate: endDate_minValue,
                            maxDate: endDate_maxValue
                        },
                        startDate: {
                            initValue: startDate_initValue,
                            minDate: startDate_minValue,
                            maxDate: startDate_maxValue
                        }
                    },
                };

            case "CONCUBINE":

                const concubines = await axios({
                    url: `${process.env.LOCALHOST}/graphql`,
                    method: 'post',
                    headers: {
                        "authorization": token
                    },
                    data: {
                        query: `query{
                              company(vergiNumarasi: "${data.company}") {
                                name
                                vergi {
                                    vergiDairesi
                                    vergiNumarasi
                                }
                                concubines {
                                    collectType
                                    debt
                                    process
                                    processDate
                                    processNumber
                                    receive
                                }
                              }
                            }`
                    }
                })

                const _cariler = [];

                let _concubines = concubines.company.concubines.map((cari, index, arr) => {
                    let subTotal = 0;
                    index === 0 ?
                        subTotal = cari.process === 'Fatura' ? cari.debt : -cari.receive
                        :
                        subTotal = cari.process === 'Fatura' ? _cariler[index - 1].subTotal + cari.debt : _cariler[index - 1].subTotal - cari.receive

                    _cariler.push({
                        ...cari,
                        companyName: _concubines.company.name,
                        vergiDairesi: _concubines.company.vergi.vergiDairesi,
                        vergiNumarasi: _concubines.company.vergi.vergiNumarasi,
                        subTotal: subTotal
                    })
                })

                let cariler = _.filter(
                    _cariler, (dayjs(cari.processDate).isSameOrBefore(data.endDate) && dayjs(cari.ErrorprocessDate).isSameOrAfter(data.startDate))
                )

                const createPDF = async (values) => {

                    const docDefinition = {
                        defaultStyle: {
                            fontSize: 9.75
                        },
                        pageMargins: [40, 65, 40, 30],
                        header: {
                            margin: [40, 20, 40, 20],
                            stack: [
                                {
                                    columns: [
                                        {
                                            width: 'auto',
                                            text: [
                                                { text: 'bodrum', fontSize: 22, color: 'coral', bold: true, lineHeight: 0.9 },
                                                {
                                                    text: [{ text: 'İSG\n', fontSize: 22, color: '#232530', bold: true, lineHeight: 0.9 },
                                                    { text: 'İş Sağlığı ve Güvenliği Hizmetleri', fontSize: 7, color: 'black', characterSpacing: 0.34 }]
                                                },
                                            ]
                                        },
                                        { text: `${dayjs().format("DD/MM/YYYY HH:mm")}`, alignment: 'right', fontSize: 11, width: '*' }
                                    ]
                                },
                            ],
                        },

                        content: [
                            //{
                            //    canvas: [
                            //        { type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 0.5, lineColor: 'coral' },
                            //        { type: 'line', x1: 0, y1: 11, x2: 515, y2: 11, lineWidth: 1.5, lineColor: 'coral' },
                            //    ]
                            //},
                            //{ text: 'Tablo İçeriği', margin: [0, 20, 0, 0]},
                            {
                                columns: [
                                    {
                                        width: 'auto',
                                        text: [
                                            { text: `${values[0].companyName}\n`, fontSize: 9.75 },
                                            { text: `${values[0].vergiDairesi}\n`, fontSize: 9.75 },
                                            { text: `${values[0].vergiNumarasi}`, fontSize: 9.75 },
                                        ]
                                    }
                                ]
                            },
                            {
                                layout: 'lightHorizontalLines',
                                margin: [0, 20],
                                table: {
                                    fontSize: 9.75,
                                    headerRows: 1,
                                    widths: ['*', '*', '*', '*', '*'],
                                    body:
                                        [['İşlem Türü', 'İşlem Tarihi', 'Tahsilat Tutarı', 'Fatura Tutarı', 'Bakiye']].concat(values.map(value =>
                                            [
                                                { text: `${value.process}`, borderColor: ['coral', 'coral', 'coral', 'coral'] },
                                                { text: `${dayjs(value.processDate).format("DD/MM/YYYY")}`, borderColor: ['coral', 'coral', 'coral', 'coral'] },
                                                {
                                                    text: `${value.receive ? new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(value.receive) : ''}`, borderColor: ['coral', 'coral', 'coral', 'coral'], color: 'green'
                                                },
                                                {
                                                    text: `${value.debt ? new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(value.debt) : ''}`, borderColor: ['coral', 'coral', 'coral', 'coral'], color: 'red'
                                                },
                                                {
                                                    text: `${new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(value.subTotal)}`, borderColor: ['coral', 'coral', 'coral', 'coral']
                                                },
                                            ]
                                        ))
                                }
                            }
                        ]
                    };

                    let filename = decryptedBody.flow_token;
                    const Path = path.join(__dirname, '../../upload');
                    const uploadPath = path.join(__dirname, '../../upload/', `${filename}.pdf`);

                    if (!existsSync(Path)) {
                        mkdirSync(Path, { recursive: true });
                    }

                    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
                    pdfDocGenerator.getBuffer(async (buffer) => {
                        writeFile(uploadPath, buffer)
                            .then(async () => {
                                const privateClaim = {
                                    "iss": decryptedBody.flow_token,
                                    "aud": process.env.MEDIA_SITE,
                                    "sub": "waba",
                                    "args": {
                                        fileName: filename,
                                        type: "upload"
                                    }
                                }


                                const mediaToken = jwt.sign(privateClaim, process.env.jwtSecret, { "expiresIn": 5 * 60 });

                                try {

                                    await axios({
                                        "method": "POST",
                                        "url": `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
                                        "headers": {
                                            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
                                        },
                                        "data": {
                                            "messaging_product": "whatsapp",
                                            "to": `${data.phoneNumber}`,
                                            "recipient_type": "individual",
                                            "type": "document",
                                            "document": {
                                                "filename": `${filename}.pdf`,
                                                "link": `https://yalikavak-358f781f0743.herokuapp.com/webhook/media/${mediaToken}`
                                            }
                                        },
                                    });

                                    return {
                                        screen: "SUCCESS",
                                        data: {
                                            extension_message_response: {
                                                params: {
                                                    "flow_token": decryptedBody.flow_token,
                                                },
                                            },
                                        },
                                    };

                                } catch (error) {
                                    throw new GraphQLError(error)
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    });
                }
                const createFile = () => {
                    try {
                        const _rows = [];
                        const Ekle = (concubine) => {
                            _rows.push({
                                'companyName': concubine.companyName,
                                'vergiDairesi': concubine.vergiDairesi,
                                'vergiNumarasi': concubine.vergiNumarasi,
                                'process': concubine.cari.process,
                                'processDate': concubine.cari.processDate,
                                'receive': concubine.cari.receive,
                                'debt': concubine.cari.debt,
                                'subTotal': concubine.subTotal,
                            })
                        }

                        cariler.map((concubine) => {
                            Ekle(concubine)
                        })

                        createPDF(_rows);
                    }
                    catch (error) {
                        console.log(error)
                    }
                }

                createFile();

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