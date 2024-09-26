const crypto = require('crypto');

const encryptResponse = async (response, aesKeyBuffer, initialVectorBuffer) => {
    // Flip the initialization vector
    const flipped_iv = [];
    for (const pair of initialVectorBuffer.entries()) {
        flipped_iv.push(~pair[1]);
    }
    // Encrypt the response data
    const cipher = crypto.createCipheriv(
        "aes-128-gcm",
        aesKeyBuffer,
        Buffer.from(flipped_iv),
    );
    return Buffer.concat([
        cipher.update(JSON.stringify(response), "utf-8"),
        cipher.final(),
        cipher.getAuthTag(),
    ]).toString("base64");
}

module.exports = encryptResponse;