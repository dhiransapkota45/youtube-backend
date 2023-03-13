const express = require("express");
const { uploadVideo, streamvideo } = require("../controllers/videoController");
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

router.post("/streamvideo/:id", verifyToken, streamvideo);


module.exports = router;
