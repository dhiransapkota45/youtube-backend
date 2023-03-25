const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

// const verifyToken = async (req, res, next, isSpecialRoute = false) => {
//   try {
//     const token = req.header("accessToken");
//     if (!token) return res.status(401).json({ message: "Access Denied" });
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     // console.log(verified);
//     const finduser = await usermodel
//       .findById(verified.id)
//       .select("-password")
//       .populate("subscriptions")
//       .populate("subscribers");
//     // .populate("videos")
//     // .populate("liked_videos")
//     // .populate("disliked_videos");
//     req.user = finduser;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid Token" });
//   }
// };

const verifyToken = async (req, res, next, isSpecialRoute = false) => {
  try {
    const token = req.header("accessToken");
    if (token) {
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      const finduser = await usermodel
        .findById(verified.id)
        .select("-password")
        .populate("subscriptions")
        .populate("subscribers");
      // .populate("videos")
      // .populate("liked_videos")
      // .populate("disliked_videos");
      req.user = finduser;
      next();
    } else {
      if (isSpecialRoute) {
        req.unverifiedUser = true;
        next();
      } else {
        return res.status(401).json({ message: "Access Denied" });
      }
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
