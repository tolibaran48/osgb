require("dotenv").config()
const crypto = require('crypto');

const decryptRequest = async (body, privatePem) => {
    let decryptedAesKey = null;
    const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;
    try {


        // Decrypt the AES key created by the client
        decryptedAesKey = crypto.privateDecrypt(
            {
                key: crypto.createPrivateKey({
                    key: privatePem,
                    format: 'pem',
                    type: 'pkcs1',//ignored if format is pem
                    passphrase: process.env.PASSPHRASE
                }),
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(encrypted_aes_key, "base64"),
        );

    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }

    // Decrypt the Flow data
    const flowDataBuffer = Buffer.from(encrypted_flow_data, "base64");
    const initialVectorBuffer = Buffer.from(initial_vector, "base64");

    const TAG_LENGTH = 16;
    const encrypted_flow_data_body = flowDataBuffer.subarray(0, -TAG_LENGTH);
    const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);

    const decipher = crypto.createDecipheriv(
        "aes-128-gcm",
        decryptedAesKey,
        initialVectorBuffer,
    );
    decipher.setAuthTag(encrypted_flow_data_tag);

    const decryptedJSONString = Buffer.concat([
        decipher.update(encrypted_flow_data_body),
        decipher.final(),
    ]).toString("utf-8");

    return {
        decryptedBody: JSON.parse(decryptedJSONString),
        aesKeyBuffer: decryptedAesKey,
        initialVectorBuffer,
    };
}

module.exports = decryptRequest;