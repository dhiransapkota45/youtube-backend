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
} = require("../controllers/videoController");
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

router.get("/getvideodetails/:id", verifyToken, getvideodetails);

router.get("/likevideo/:id", verifyToken, likevideo);

router.get("/dislikevideo/:id", verifyToken, dislikevideo);

router.get("/getlikedvideos", verifyToken, getlikedvideos);

router.get("/getdislikedvideos", verifyToken, getdislikedvideos);

router.get("/getallvideos", verifyToken, getallvideos);

module.exports = router;
