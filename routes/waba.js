const router = require('express').Router();
require("dotenv").config()
const mediaAuth = require("../helpers/mediaAuth");
const axios = require('axios');
const send_START = require("../functions/waba/send_START");
const path = require('path');
const WabaConversation = require("../models/WabaConversation");
const START_muhasebe_fatura = require('../functions/waba/START_muhasebe_fatura');
const START_muhasebe_bakiye = require('../functions/waba/START_muhasebe_bakiye');
const START_isg_personelEvrak = require('../functions/waba/START_isg_personelEvrak');
const createToken = require('../helpers/token');

router.get("/", async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  // check the mode and token sent are correct
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

router.get("/media/:media_id", async (req, res) => {
  const { media_id } = req.params
  try {
    const values = await mediaAuth(media_id);

    const { type, fileName } = values;
    res.sendFile(path.join(process.cwd(), `/${type}/${fileName}`));
  }
  catch (error) {
    throw new Error(error)
  }
});


const getMessageType = async (req) => {
  const comingValue = req.body.entry?.[0]?.changes[0]?.value;
  let comingMessage;
  let comingMessageType;
  let mainMessageType;
  let messageType;
  let messageFrom;

  comingMessage = comingValue.messages?.[0];

  if (comingMessage) {

    comingMessageType = comingMessage.type;
    if (comingMessageType) {
      if (comingMessageType === "unsupported" || comingMessageType === "system" || comingMessageType === "unknown") {
        messageFrom = "system"
        switch (comingMessageType) {
          case "unsupported":
            messageType = "status";
            mainMessageType = "deleted" // Mesaj Silindi
            break;
          case "system":
            messageType = "information";
            mainMessageType = "phoneChanged" //--------- Phone Number Changed / Telefon Numarası Değişikliği
            break;
          case "unknown":
            messageType = "information";
            mainMessageType = "unknownMessage" //--------- Unknown Message / Bilinmeyen Mesaj
            break;
        }
      }
      else {
        messageFrom = "external"
        switch (comingMessageType) {
          case "text":
            if (comingMessage.referral) {
              messageType = "directly"
              mainMessageType = "clickToWhatsapp" //Received Message Triggered by Click to WhatsApp Ads / Tıkla WhatsApp Reklamlarıyla Tetiklenen Alınan Mesaj
              message = comingMessage;
            }
            else if (comingMessage.context) {
              messageType = "query"
              mainMessageType = "productQuery" //Product Inquiry Messages / Ürün Sorgulama Mesajı
            }
            else {
              messageType = "directly"
              mainMessageType = "text"
            }
            break;
          case "reaction":
            messageType = "directly"
            mainMessageType = "reaction"
            break;
          case "image":
            messageType = "directly"
            mainMessageType = "image"
            break;
          case "sticker":
            messageType = "directly"
            mainMessageType = "sticker"
            break;
          case "video":
            messageType = "directly"
            mainMessageType = "video"
            break;
          case "audio":
            messageType = "directly"
            mainMessageType = "audio"
            break;
          case "document":
            messageType = "directly"
            mainMessageType = "document"
            break;
          case "order":
            messageType = "order"
            mainMessageType = "order"
            break;
          case "button":
            messageType = "received"
            mainMessageType = "button"
            break;
          case "interactive":
            messageType = "received"
            mainMessageType = comingMessage.interactive.type;
            break;
        }
      }
    }
    else {
      messageFrom = "external"
      messageType = "directly"
      if (comingMessage.location) {
        mainMessageType = "location"
      }
      else if (comingMessage.contacts) {
        mainMessageType = "contacts"
      }
    }
  }
  else {
    messageFrom = "system"
    messageType = "status";    //message status send/delivered/read/failed
    if (comingValue.statuses) {
      if (comingValue.statuses[0].conversation) {
        if (comingValue.statuses[0].conversation.expiration_timestamp) {
          mainMessageType = "sent" //Ücretsiz Mesaj Gönderildi
        }
        else {
          mainMessageType = "delivered" // Ücretli Mesaj İletildi
        }
      }
      else {
        if (comingValue.statuses[0].status) {
          if (comingValue.statuses[0].status === "read") {
            mainMessageType = "read" // Mesaj Okundu
          }
          else if (comingValue.statuses[0].status === "failed") {
            mainMessageType = "failed" // Mesaj Başarısız
          }
        }
      }
    }
  }

  if (messageFrom === "external") {
    return ({ "messageFrom": messageFrom, "messageType": messageType, "mainMessageType": mainMessageType, "message": comingMessage })
  }
  else {
    return ({ "messageFrom": messageFrom, "messageType": messageType, "mainMessageType": mainMessageType })
  }
}

router.post("/", async (req, res) => {
  const message = await getMessageType(req)
  if (message.messageFrom === "external") {
    console.log(message);
    if (message.messageType !== "received") {
      send_START(message.message.from)
    }
    else {
      switch (message.mainMessageType) {
        case "list_reply":
          switch (message.message.interactive.list_reply.id) {
            case "START_muhasebe_fatura":
              START_muhasebe_fatura(`${message.message.from}`)
              break;
            case "START_muhasebe_bakiye":
              START_muhasebe_bakiye(`${message.message.from}`)
              break;
            case "START_isg_personelEvrak":
              START_isg_personelEvrak(`${message.message.from}`)
              break;
          }

          break;
      }
    }
  }
  /*const message = {
    messageFrom: "external",
    messageType: "directly",
    mainMessageType: "text",
    message: {
      "from": "5494191961",
      "id": "<WHATSAPP_MESSAGE_ID>",
      "timestamp": "1603069091",
      "text": {
        "body": "Merhaba"
      },
      "type": "text"
    }
  }
  let conversation = await WabaConversation.findOne({ phoneNumber: message.message.from, status: true })
  if (conversation) {
    if (conversation.mainTemplate === "START" && message.messageType === "list_replay") {
      //NORMAL İŞLEME DEVAM
    }
    else {

    }
  }
  else {
    let time = dayjs(new Date());
    send_START()
    const conversation = new WabaConversation({
      phoneNumber: message.message.from,
      status: true,
      templateType: 'list_reply',
      mainTemplate: 'START',
      lastTimestamp: time,
      conversations: [
        {
          messageFrom: message.messageFrom,
          messageType: message.messageType,
          mainMessageType: message.mainMessageType,
          timestamp: dayjs.unix(message.message.timestamp),
          message: Buffer.from(JSON.stringify(message.message))
        },
        {
          messageFrom: "internal",
          messageType: "received",
          mainMessageType: "list_replay",
          mainTemplate: "START",
          timestamp: time
        }
      ]
    })
    conversation.save()
  }*/

  //console.log(dayjs(from.lastTimestamp).add(10, 'minute'))
  //let donus = dayjs(from.lastTimestamp).add(10, 'minute').isSameOrAfter(dayjs(new Date()))
  //console.log({ donus })
  /*if (from) {
    let now = dayjs(new Date())
    let unix = now.unix()
    let _now = now.add(15, 'minute')
    let _unix = _now.unix()
    console.log({ unix, _unix })
    let conversation = await WabaConversation.findOneAndUpdate({ phoneNumber: '5494191961', status: true }, {
      $set: { lastTimestamp: dayjs() }
      , $push: { conversations: { messageFrom: message.messageFrom, messageType: message.messageType, mainMessageType: message.mainMessageType, timestamp: dayjs.unix(message.message.timestamp), message: Buffer.from(JSON.stringify(message.message)) } }
    }, { new: true })

    console.log(conversation)
  }
  else {
    send_START()
    const conversation = new WabaConversation({
      phoneNumber: message.message.from,
      status: true,
      lastTimestamp: dayjs().unix(),
      conversations: [{
        messageFrom: message.messageFrom,
        messageType: message.messageType,
        mainMessageType: message.mainMessageType,
        timestamp: message.message.timestamp,
        message: Buffer.from(JSON.stringify(message.message))
      }]
    })
    conversation.save()
  }*/

  res.sendStatus(200);
});

module.exports = router;