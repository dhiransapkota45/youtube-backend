const mongoose = require("mongoose");

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
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags : [
      {
        type: String,
        enum:["Music","Gaming","Sports","News","Movies","Comedy","Education","Entertainment","Fashion","Science","Technology","Travel","Vlogs","Animals","Autos","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education"]
      }
    ],
  },
  { timestamps: true }
);

const videomodel = mongoose.model("videomodel", videoSchema);
module.exports = videomodel;
