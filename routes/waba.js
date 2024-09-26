const router = require('express').Router();
require("dotenv").config()
const mediaAuth = require("../helpers/mediaAuth");

router.get("/", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // check the mode and token sent are correct
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    } else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});

router.get("/media/:media_id", async(req, res) => {
  const {media_id}=req.params
  try {
    const values=await mediaAuth(media_id); 
    const {type,fileName}=values.args;
    res.sendFile(process.cwd()+`/${type}/${fileName}.pdf`);
  }
  catch(error)
  {
      throw new GraphQLError('Biletiniz geçersiz', {
          extensions: {                
              code: 'Unauthorized',
              status: 401,
          },
      })
  }
});

router.post("/", async (req, res) => {
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    //console.log({ "message_type": message?.type })
    console.log({message})

    // check if the incoming message contains text
    /*if (message?.type === "text") {*/
    // extract the business number to send the reply from it
    const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const name = req.body.entry?.[0].changes?.[0].value?.contacts?.[0].profile?.name;
    const messageType = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].interactive?.type;

   /* await axios({
        "method": "POST",
        "url": `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        "headers": {
            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
        },
        "data": {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": message.from,
            "text": {
                "body": `_Sayın Müşterimiz,_\n
          *Ödenmeyen borcunuzdan dolayı dosyanız yasal takip sürecine alınmıştır.*\nGüncel borcunuz *116.145,60 TL* olup, gün içerisinde ödenmediği takdirde borcunuz için *yasal yollara* başvurulacağını bilgilerinize sunarız.\n\n_Saygılarımızla,_`
            }

        },
    });*/



    res.sendStatus(200);
});
module.exports = router;



    /*}*/
    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    /* await axios({
       method: "POST",
       url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
       headers: {
         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
       },
       data: {
         messaging_product: "whatsapp",
   recipient_type: "individual",
   to: message.from, 
         text: {
         body: `${message.from}`
       }*/
    /*type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: `Merhaba, ${name}`
      },
      body: {
        text: "Size nasıl yardımcı olabilirim?"
      },
      footer: {
        text: "Aşağıdaki listeden seçim yapabilirsiniz."
      },
      action: {
        button: "İşlem Listesi",
        sections: [
          {
            title: "MUHASEBE İŞLEMLERİ",
            rows: [
              {
                id: "1.1",
                title: "Fatura İşlemleri",
                description: "Kesilene faturalarınıza ulaşmak için"
              },
              {
                id: "1.2",
                title: "Güncel Bakiye",
                description: "Güncel bakiyeniz buradan ulaşabilirsiniz"
              }
            ]
          },
          {
            title: "HALKLA İLİŞKELER",
            rows: [
              {
                id: "2.1",
                title: "Teklif Alma",
                description: "Müşterimiz olmak istermisiniz"
              },
              {
                id: "2.2",
                title: "İSG İşlemleri",
                description: "Evrak / Bilgi talebi almak istermisiniz"
              }
            ]
          }
        ]
      }
    }
    
         
          
        },
      });*/

    // mark incoming message as read
    /*   await axios({
         method: "POST",
         url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
         headers: {
           Authorization: `Bearer ${GRAPH_API_TOKEN}`,
         },
         data: {
           messaging_product: "whatsapp",
           status: "read",
           message_id: message.id,
         },
       });
     }
     if(message?.interactive?.type==="list_reply"){
       
       const business_phone_number_id =req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
        const name =req.body.entry?.[0].changes?.[0].value?.contacts?.[0].profile?.name;
       const messageType =req.body.entry?.[0]?.changes[0]?.value?.messages?.[0].interactive?.type;
       
        await axios({
         method: "POST",
         url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
         headers: {
           Authorization: `Bearer ${GRAPH_API_TOKEN}`,
         },
         data: {
           
     
           "messaging_product": "whatsapp",
     "recipient_type": "individual",
     "type": "interactive",
     "to": message.from,
     "interactive": {
       "type": "location_request_message",
       "body": {
         "text": "Konumunuzu göndermeniz durumunda, size yönlendirme yapabilirim"
       },
       "action": {
         "name": "send_location"
       }
     }
          
           
         },
       });
     }*/