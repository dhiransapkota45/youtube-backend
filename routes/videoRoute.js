const express = require("express");
const { uploadVideo } = require("../controllers/videoController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../utils/multer-video");
const videoValidation = require("../validation/videoValidation");
const router = express.Router();

router.post(
  "/uploadvideo",
  verifyToken,
  upload.single("video"),
  videoValidation,
  uploadVideo
);

module.exports = router;
