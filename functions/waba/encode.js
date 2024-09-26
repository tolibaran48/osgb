const axios = require('axios');

const resp = await axios({
    "method": "POST",
    "url": `https://graph.facebook.com/v18.0/${'*'}/whatsapp_business_encryption`,
    "headers": {
        Authorization: `Bearer ${'*'}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
        business_public_key: `${"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApSzNNRbjeFVq8YpjMY3P\nVnhMTsbvlvrqY/qyfuugz2tTFbw6xzlnoTv9hHYhuUukf1UuThc3Kp10NB4i5nRB\npvvCzlrwXrfH4c+sIOX+Xj/mlaCFRk6Dgu9cQJUgXCujcy0pBWryQi7e1BVoM4Mk\nokC29lgQUKL8njG09tdkwnt+G8ApE32bnq+uf/pxbAY1PSxcArzfNOeAsERqSplT\nVdcguHkCWUBcmtc4Gj70EnSXPtArEqmnCLgAxV1qHK79XQjfFPtHu92orPaniKtx\nE7nre+kBtK9BQ5sTOtCZGdjite8rL0BZgWruwJVjsa42zyp6KmlSZo2lB1PHNc1uaQIDAQAB\n-----END PUBLIC KEY-----"
            }`
    }
})

const respo = await axios({
    "method": "GET",
    "url": `https://graph.facebook.com/v18.0/${'*'}/whatsapp_business_encryption`,
    "headers": {
        Authorization: `Bearer ${'*'}`
    }
})