const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  createcomment,
  likecomment,
  dislikecomment,
} = require("../controllers/commentController");

router.post("/createcomment", verifyToken, createcomment);
router.post("/likecomment/:id", verifyToken, likecomment);
router.post("/dislikecomment/:id", verifyToken, dislikecomment);

module.exports = router;
