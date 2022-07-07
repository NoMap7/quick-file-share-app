const router = require('express').Router();
const File = require('../models/File');

router.get('/:uuid', async (req, res) => {
    //FOR FILE DOWNLOAD
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.render('downloadPage', {error: 'Link expired.'});
        }
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    } catch (error) {
        return res.render('downloadPage', {error: 'Something went wrong!'});
    }
})

module.exports = router;