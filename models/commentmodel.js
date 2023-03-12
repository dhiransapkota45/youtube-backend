const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
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
    ref: "Comment",
    default: null,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const commentmodel = mongoose.model("commentmodel", commentSchema);
module.exports = commentmodel;
