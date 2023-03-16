const express = require("express");
const {
  signup,
  signin,
  subscribe,
  unsubscribe,
  verifyRefeshToken
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const upload = require("../utils/multer-image");
const signupValidation = require("../validation/signupValidation");

router.get("/verifyrefresh", verifyRefeshToken);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.post("/signin", signin);
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);

module.exports = router;
