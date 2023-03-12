//fullname, username, password, profile_pic, description, subscribers, subscriptions, total_views, liked_videos, disliked_videos, videos,

const usermodel = require("../models/usermodel");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const finduser = await usermodel.find({ username: req.body.username });
    if (finduser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newuser = await usermodel.create({
      ...req.body,
      profile_pic: req.file.filename,
    });

    const token = generateToken(newuser._id);
    return res.status(201).json({ accessToken: token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const signin = async (req, res) => {
  try {
    const finduser = await usermodel.findOne({ username: req.body.username });
    if (!finduser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (req.body.password !== finduser.password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(finduser._id);
    return res.status(200).json({ accessToken: token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const subscribe = async (req, res) => {
  try {
    const finduser = await usermodel.findById(req.body._id);
    if (!finduser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const subscription = await usermodel.findByIdAndUpdate(
      req.user._id,
      { $push: { subscriptions: req.body._id } },
      { new: true }
    );

    const subscriber = await usermodel.findByIdAndUpdate(
      req.body._id,
      {
        $push: { subscribers: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "Subscription added successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const unsubscribe = async (req, res) => {
  try {
    const finduser = await usermodel.findById(req.body._id);
    if (!finduser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const unsubscription = await usermodel.findByIdAndUpdate(
      req.user._id,
      { $pull: { subscriptions: req.body._id } },
      { new: true }
    );

    const unsubscriber = await usermodel.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { subscribers: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "unsubscribed successfully!" });
  } catch (error) {
    return res.status(500).json(error);
  }
};



module.exports = { signin, signup, subscribe, unsubscribe };
