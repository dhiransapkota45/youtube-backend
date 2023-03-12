const express = require("express");
const { signup, signin } = require("../controllers/userController");
const router = express.Router();

const upload = require("../utils/multer-image");
const signupValidation = require("../validation/signupValidation");

router.post("/signup", upload.single("image"), signupValidation, signup);
router.post("/signin", signin);

module.exports = router;
