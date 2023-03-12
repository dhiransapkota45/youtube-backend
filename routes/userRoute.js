const express = require("express");
const { signup, signin } = require("../controllers/userController");
const router = express.Router();

const upload = require("../utils/multer-image");

router.post("/signup", upload.single("image"), signup);
router.post("/signin", signin);

module.exports = router;
