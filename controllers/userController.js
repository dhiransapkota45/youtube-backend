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

    const accessToken = generateToken(newuser._id, "access");
    const refreshToken = generateToken(newuser._id, "refresh");
    return res
      .status(201)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
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

    const accessToken = generateToken(finduser._id, "access");
    const refreshToken = generateToken(finduser._id, "refresh");
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const subscribe = async (req, res) => {
  try {
    if (req.user._id === req.body._id)
      return res
        .status(400)
        .json({ message: "You cannot subscribe to yourself" });

    const finduser = await usermodel.findById(req.body._id);
    if (!finduser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const subscription = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        $push: { subscriptions: req.body._id },
        $inc: { subscriptionLength: 1 },
      },
      { new: true }
    );

    const subscriber = await usermodel.findByIdAndUpdate(
      req.body._id,
      {
        $push: { subscribers: req.user._id },
        $inc: { subscribersLength: 1 },
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

const verifyRefeshToken = async (req, res) => {
  try {
    const refreshToken = req.header("refreshToken");
    if (!refreshToken)
      return res.status(401).json({ message: "Access Denied" });

    const verified = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!verified) return res.status(403).json({ message: "Access Denied" });

    const accessToken = generateToken(verified.id, "access");
    const newRefreshToken = generateToken(verified.id, "refresh");

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getSubScribedChannels = async (req, res) => {
  try {
    const finduser = await usermodel.findById(req.user._id);
    if (!finduser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const subscribedChannels = await usermodel
      .find({
        _id: { $in: finduser.subscriptions },
      })
      .select("-password -subscribers -subscriptions");

    return res.status(200).json({ subscribedChannels });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  signin,
  signup,
  subscribe,
  unsubscribe,
  verifyRefeshToken,
  getSubScribedChannels,
};
