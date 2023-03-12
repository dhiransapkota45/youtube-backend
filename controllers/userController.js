// subscribers, subscriptions, password, profile_pic, description, total_views, liked_videos, disliked_videos, videos, fullname, username

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

module.exports = { signin, signup };
