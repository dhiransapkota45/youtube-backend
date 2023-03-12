const mongoose = require("mogoose");

const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commentmodel",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodel",
    },
  },
  { timestamps: true }
);

const videomodel = mongoose.model("videomodel", videoSchema);
module.exports = videomodel;
