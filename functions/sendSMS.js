//const config=require("config");
require("dotenv").config()
const xmlbuilder = require("xmlbuilder");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const turkishToEnglish = require('./turkishToEnglish');

const sendSmsOnce = (phoneNumber, text) => {
    console.log(phoneNumber, text)
    const convertText = turkishToEnglish(text);

    function createXML() {
        const xml = xmlbuilder.create("SMS-InsRequest", { 'version': '1.0', 'encoding': 'iso-8859-9' })
            .ele('CLIENT', { 'user': process.env.smsUser, 'pwd': process.env.smsPwd }).up()
            .ele('INSERT', { 'to': phoneNumber, 'text': convertText })
            .end({ pretty: true })
        sendXML(xml);
    }

    function sendXML(xml) {

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://www.postaguvercini.com/api_xml/Sms_insreq.asp");
        xhttp.setRequestHeader("Content-Type", "text/xml");
        xhttp.send(xml)
    }

    let result = createXML()
    console.log(result)
}

module.exports = sendSmsOnce;