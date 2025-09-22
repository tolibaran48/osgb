const router = require("express").Router();
require("dotenv").config()
const path = require('path');
const auth = require("../helpers/auth");
const mediaAuth = require("../helpers/mediaAuth");


router.get("/:media_id", async (req, res) => {
    try {
        const { media_id } = req.params
        const values = await mediaAuth(media_id);

        const { type, fileName } = values;
        res.download(path.join(process.cwd(), `/${type}/${fileName}`), `_${fileName}`);
    }
    catch (error) {
        console.error('File download failed:', err);
    }
});


module.exports = router;