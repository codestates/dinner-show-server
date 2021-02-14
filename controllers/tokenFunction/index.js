require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "1d" });
  },
  generateRefreshToken: (data) => {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: "10d" });
  },
  sendAccessToken: (res, accessTk) => {
    res.status(200).send({ data: { accessToken: accessTk }, message: "ok" });
  },
  resendAccessToken: (res, newAccessTk, data) => {
    res
      .status(200)
      .send({ data: { accessToken: newAccessTk, data: data }, message: "ok" });
  },
  sendRefreshToken: (res, refreshTk) => {
    console.log("hello cookie");
    res.cookie("refreshToken", refreshTk, { httpOnly: true });
  },
  isAuthorized: (req) => {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    const token = authorization.split(" ")[1];
    console.log(authorization);
    try {
      return verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  },
  checkRefeshToken: (refreshToken) => {
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      // return null if refresh token is not valid
      return null;
    }
  },
};
