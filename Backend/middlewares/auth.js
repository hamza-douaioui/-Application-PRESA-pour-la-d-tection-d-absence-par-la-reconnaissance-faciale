const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function login(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("No token...");

  try {
    const decoded = jwt.verify(token, config.get("JWT_PRIVATE_KEY"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).send("invalid token...");
  }
};
