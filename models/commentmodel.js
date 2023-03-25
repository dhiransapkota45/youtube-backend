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
});

commentSchema.virtual("totalReplies").get(function () {
  return this.replies.length;
});

const commentmodel = mongoose.model("commentmodel", commentSchema);
module.exports = commentmodel;
