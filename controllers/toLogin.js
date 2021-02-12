const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  isAuthorized,
  checkRefeshToken,
  resendAccessToken,
} = require("./tokenFunction");
const {
  content: Content,
  user: User,
  comment: Comment,
} = require("../models/index.js");
const bcrypt = require("bcrypt");

module.exports = {
  postLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).send({ data: null, message: "not Authorized" });
      let data = await User.findOne({
        where: {
          email: email,
        },
      });
      const match = await bcrypt.compare(password, data.user_password);
      if (match) {
        let contentData = await Content.findAll({
          where: {
            userId: data.dataValues.id,
          },
        });
        data.dataValues.userContents = [];
        contentData.forEach((el) => {
          data.dataValues.userContents.push(el.dataValues);
        });
        delete data.dataValues.user_password;
        let accessTk = generateAccessToken(data.dataValues);
        let refreshTk = generateRefreshToken(data.dataValues);

        sendRefreshToken(res, refreshTk);
        sendAccessToken(res, accessTk);
      } else {
        res.status(400).send({ data: null, message: "not Authorized" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getDataByToken: (req, res) => {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      return res
        .status(401)
        .send({ message: "no token in req.headers['authorization']" });
    }
    res.status(200).send({ data: accessTokenData, message: "ok" });
  },
  getDataByRtoken: async (req, res) => {
    console.log("refresh token");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).send({ message: "refresh token not provided" });
    const refreshTokenData = checkRefeshToken(refreshToken);
    if (!refreshTokenData) {
      return res
        .status(401)
        .send({ message: "invalid refresh token, pleaes log in again" });
    }
    let data = await User.findOne({
      where: {
        id: refreshTokenData.id,
      },
    });
    let contentData = await Content.findAll({
      where: {
        userId: refreshTokenData.id,
      },
    });
    data.dataValues.userContents = [];
    contentData.forEach((el) => {
      data.dataValues.userContents.push(el.dataValues);
    });
    const newAccessTk = generateAccessToken(data.dataValues);
    resendAccessToken(res, newAccessTk, data.dataValues);
  },

  postLogout: (req, res) => {
    if (!req.cookies.refreshToken)
      res.status(400).json({ data: null, message: "not authorized" });
    else {
      res.clearCookie("refreshToken");
      res.json({ data: null, message: "logout Success" });
    }
  },
};
