const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/thumbnails/");
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

const uploadThumbnail = multer({ storage: storage });

module.exports = uploadThumbnail;
