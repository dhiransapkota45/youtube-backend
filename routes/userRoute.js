const express = require("express");
const {
  signup,
  signin,
  subscribe,
  unsubscribe,
  verifyRefeshToken,
  getSubScribedChannels,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const upload = require("../utils/multer-image");
const signupValidation = require("../validation/signupValidation");

router.post("/verifyrefresh", verifyRefeshToken);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.post("/signin", signin);
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);

//from here subscribers need to be removed
router.get("/user", verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/getsubscriptions", verifyToken, getSubScribedChannels);

module.exports = router;
