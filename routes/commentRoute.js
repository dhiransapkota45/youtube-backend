const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  createcomment,
  likecomment,
  dislikecomment,
  getReplies,
} = require("../controllers/commentController");

router.post("/createcomment", verifyToken, createcomment);
router.post("/likecomment/:id", verifyToken, likecomment);
router.post("/dislikecomment/:id", verifyToken, dislikecomment);
router.post("/getreplies", getReplies);

module.exports = router;
