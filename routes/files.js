const router = require("express").Router();

const multer = require("multer"); // file handling
const path = require("path");
const File = require("../models/file");

const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

let upload = multer({
  storage,
  limit: { fileSize: 1024 * 1024 * 100 }
}).single("myfile");

router.post("/", (req, res) => {
  // store file
  upload(req, res, async err => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All fields are required" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
    });

    // http://localhost:3000/files/cjkdhshlsdj6575783   link for download
  });
});

router.post("/send", async (req, res) => {
  // console.log(req.body);
  // return res.send({});
  const { uuid, emailTo, emailFrom } = req.body;

  //validate
  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: "All Fields are required." });
  }

  // get data from database

  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  //Send  email

  const sendMail = require("../services/emailServices");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "inShare File sahring",
    text: `${emailFrom} shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hrs"
    })
  });

  return res.send({ success: true });
});

module.exports = router;
