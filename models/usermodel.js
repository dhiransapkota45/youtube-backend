const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profile_pic: {
    type: String,
    default:
      "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png",
  },
  password: {
    type: String,
    required: true,
  },
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodel",
    },
  ],
  subscriptionLength: {
    type: Number,
    default: 0,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermodel",
    },
  ],
  subscribersLength: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  watchLater: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videomodel",
    },
  ],
  tags : [
    {
      type: String,
      enum:["Music","Gaming","Sports","News","Movies","Comedy","Education","Entertainment","Fashion","Science","Technology","Travel","Vlogs","Animals","Autos","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education","Entertainment","Film","Howto","Music","News","Nonprofits","Activism","People","Animals","Tech","Shows","Trailers","Travel","Vlogs","Sports","Science","Movies","Gaming","Food","Comedy","Education"]
    }
  ],
  // videos: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "videomodel",
  //   },
  // ],
  // total_views: {
  //   type: Number,
  //   default: 0,
  // },
  // liked_videos: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "videomodel",
  //   },
  // ],
  // disliked_videos: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "videomodel",
  //   },
  // ],
});

const usermodel = mongoose.model("usermodel", userSchema);
module.exports = usermodel;
