require("dotenv").config()
const axios = require('axios');

const send_START = async (to) => {
    const response = await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${process.env.WABA_PHONE_ID}/messages`,
        headers: {
            Authorization: `Bearer ${process.env.WABA_API_TOKEN}`,
        },
        data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: `${to}`,
            type: "interactive",
            interactive: {
                type: "list",
                header: {
                    type: "text",
                    text: "Bodrum Yalıkavak OSGB’ye Hoş Geldiniz!"
                },
                body: {
                    text: "Bizimle iletişime geçtiğiniz için teşekkür ederiz. Sizlere daha iyi hizmet verebilmek adına sürekli olarak kendimizi yenilemeye ve geliştirmeye devam edeceğiz.\n\n_*Lütfen aşağıdaki butona tıklayarak açılan listeden yapmak istediğiniz işlemi seçin.*_ "
                },
                footer: {
                    text: ""
                },
                action: {
                    button: "İşlem Listesi",
                    sections: [
                        {
                            title: "İSG_İŞLEMLERİ",
                            rows: [
                                {
                                    id: "START_isg_personelEvrak",
                                    title: "Personel Evrakları",
                                    description: "Personelinize düzenlenen İSG evraklarına buradan ulaşabilirsiniz."
                                }
                            ]
                        },
                        {
                            title: "MUHASEBE İŞLEMLERİ",
                            rows: [
                                {
                                    id: "START_muhasebe_fatura",
                                    title: "Fatura İşlemleri",
                                    description: "Kesilen faturalarınıza buradan ulaşabilirsiniz."
                                },
                                {
                                    id: "START_muhasebe_bakiye",
                                    title: "Güncel Bakiye",
                                    description: "Güncel bakiyenizi buradan öğrenebilirsiniz."
                                },
                                {
                                    id: "START_muhasebe_hesapNO",
                                    title: "Hesap Numaramız",
                                    description: "Banka Hesap Numaramızı buradan öğrenebilirsiniz."
                                }
                            ]
                        },
                        {
                            title: "HALKLA İLİŞKİLER",
                            rows: [
                                {
                                    id: "START_halklaIliskiler_teklif",
                                    title: "Teklif",
                                    description: "Müşterimiz olmak istermisiniz ?"
                                }
                            ]
                        },
                        {
                            title: "ŞİRKET BİLGİLERİ",
                            rows: [
                                {
                                    id: "START_location",
                                    title: "Lokasyon",
                                    description: "Konum bilgilerimize buradan ulaşabilirsiniz."
                                }
                            ]
                        }
                    ]
                }
            }
        },
    });
    return response
}

module.exports = send_START;