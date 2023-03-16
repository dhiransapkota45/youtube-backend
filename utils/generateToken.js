const jwt = require("jsonwebtoken");

const generateToken = (id, tokentype) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: tokentype === "access" ? "15m" : "7d",
  });
  return token;
};

module.exports = generateToken;
