const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname.replace(/\s/g, "").toLocaleLowerCase()
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
