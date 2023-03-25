const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "videomodel",
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usermodel",
  },
  comment: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodel",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodel",
    },
  ],

  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "commentmodel",
    default: null,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "commentmodel",
    },
  ],
  replyCount: {
    type: Number,
    default: 0,
  },
});

const commentmodel = mongoose.model("commentmodel", commentSchema);
module.exports = commentmodel;
