const express = require("express");
const {
  uploadVideo,
  streamvideo,
  getvideodetails,
  likevideo,
  dislikevideo,
  getlikedvideos,
  getdislikedvideos,
  getallvideos,
  thumbnailupload,
} = require("../controllers/videoController");
const verifyToken = require("../middlewares/verifyToken");
const uploadThumbnail = require("../utils/multer-thumbnail");
const upload = require("../utils/multer-video");
const videoValidation = require("../validation/videoValidation");
const router = express.Router();

router.post(
  "/uploadvideo",
  verifyToken,
  upload.single("video"),
  // uploadThumbnail.single("thumbnail"),
  videoValidation,
  uploadVideo
);

router.post(
  "/thumbnailupload/:id",
  verifyToken,
  uploadThumbnail.single("thumbnail"),
  thumbnailupload
);

router.post("/streamvideo/:id", verifyToken, streamvideo);

router.get("/getvideodetails/:id", verifyToken, getvideodetails);

router.get("/likevideo/:id", verifyToken, likevideo);

router.get("/dislikevideo/:id", verifyToken, dislikevideo);

router.get("/getlikedvideos", verifyToken, getlikedvideos);

router.get("/getdislikedvideos", verifyToken, getdislikedvideos);

router.get("/getallvideos", verifyToken, getallvideos);

module.exports = router;
