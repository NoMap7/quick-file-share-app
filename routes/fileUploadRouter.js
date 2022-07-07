const router = require("express").Router();
const multer = require("multer");
const File = require("../models/File");
const sendMail = require("../services/emailService");
const { v4: uuid4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e9)}_${
      file.originalname
    }`;
    cb(null, uniqueName);
  },
});

const uploads = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("myFile");

router.post("/", (req, res) => {
  //FOR UPLOADING FILE
  uploads(req, res, async (err) => {
    //validate req
    if (!req.file) {
      return res.json({ error: "No file was received." });
    }

    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    //store into db
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    //res -> link for file
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});


router.post("/send", async (req, res) => {
    //FOR SENDING DOWNLOAD LINK TO AN EMAIL
  const { uuid, emailTo, emailFrom, senderName } = req.body;
  console.log(req.body)
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({
      error: "All fields are required",
    });
  }

  try {
    //get file
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent." });
    }

    //send mail
    await sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "File Share download link",
      html: `<div><h3>Hello there,</h3><p><strong>${emailFrom}</strong> has shared a file with you. Visit the following link to download the file.</p><a href="${process.env.APP_BASE_URL}/files/${file.uuid}">Download Link </a><strong>Valid only for 24 hours.</strong></div>`,
    });
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
  } catch (error) {
    res.status(500).send({ error: "Something went wrong." });
  }

  return res.send({ success: true });
});

module.exports = router;
