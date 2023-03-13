const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("accessToken");
    if (!token) return res.status(401).json({ message: "Access Denied" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(verified);
    const finduser = await usermodel.findById(verified.id);
    req.user = finduser;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
