const express = require("express");
const {
  signup,
  signin,
  subscribe,
  unsubscribe,
  verifyRefeshToken,
  getSubScribedChannels,
  getChannelDetails,
  watchLater,
  getWatchLater,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const upload = require("../utils/multer-image");
const signupValidation = require("../validation/signupValidation");
const videomodel = require("../models/videomodel");

router.post("/verifyrefresh", verifyRefeshToken);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.post("/signin", signin);
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);

//from here subscribers need to be removed
router.get("/user", verifyToken, async (req, res) => {
  const videos = await videomodel.find({ uploader: req.user._id });
  const usertoobj = req.user.toObject();
  const newsponse = { ...usertoobj, videos: videos };
  return res.status(200).json({ user: newsponse });
});

router.get("/getsubscriptions", verifyToken, getSubScribedChannels);

router.post("/getchannel", getChannelDetails);
router.post("/watchlater", verifyToken, watchLater);
router.get("/getwatchlater", verifyToken, getWatchLater);

module.exports = router;
