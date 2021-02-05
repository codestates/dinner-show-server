require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "20s" });
  },
  generateRefreshToken: (data) => {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: "10d" });
  },
  sendAccessToken: (res, accessTk) => {
    res.json({ data: accessTk, message: "ok" });
  },
  sendRefreshToken: (res, refreshTk) => {
    res.cookie("refreshToken", refreshTk, { httpOnly: true });
  },
};
