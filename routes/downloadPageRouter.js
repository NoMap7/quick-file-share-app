const router = require('express').Router();
const File = require('../models/File');;

router.get('/:uuid', async (req, res) => {
    //FOR DOWNLOAD LINK PAGE
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file){
            return res.render('downloadPage', {error: 'Download link expired or no such file exists.'});
        }
        // return res.json({
        //     //in case of rest api 
        //     uuid: file.uuid,
        //     fileName: file.fileName,
        //     fileSize: file.fileSize,
        //     downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        // })
        console.log(file)
        return res.render('downloadPage', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        })
    } catch (error) {
        return res.render('downloadPage', {error: 'Something went wrong! Please try after some time.'});
    }

});




module.exports = router;