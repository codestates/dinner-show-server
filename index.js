const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const HTTPS_PORT = process.env.HTTPS_PORT || 5000;

dotenv.config();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
  })
);

app.get("/deploytest", async (req, res) => {
  let result = await User.findAll();
  console.log("ok");
  res.status(200).send(result);
});

app.listen(HTTPS_PORT, () => {
  console.log("server connect ");
});

///

const {
  content: Content,
  user: User,
  comment: Comment,
} = require("./models/index.js");

app.post("/contents", async (req, res) => {
  const { user_id: userId, title, content, tag } = req.body;
  await Content.create({ title, content, tag, userId });
  res.send("content 등록하기");
});
app.get("/contents/:id", (req, res) => {
  res.send("content 불러오기" + req.params.id);
});
app.post("/contents/update", (req, res) => {
  res.send("content 수정하기 or 하트넘버만 교체");
});
app.delete("/contents", (req, res) => {
  res.send("content 삭제하기");
});
app.get("/contents/search/:text", (req, res) => {
  res.send("search 로 content 조회");
});

app.post("/comment", (req, res) => {
  res.send("comment 등록");
});
app.post("/comment/update", (req, res) => {
  res.send("comment 수정");
});
app.delete("/comment:id", (req, res) => {
  res.send("comment 삭제");
});

app.post("/users/signup", (req, res) => {
  res.send("user login 구현");
});

app.get("/userinfo", async (req, res) => {
  let result = await User.findAll();
  console.log("ok");
  res.status(200).send(result);
});
app.post("/userinfo", (req, res) => {
  res.send("수정버튼시 구현유저인포");
});
app.delete("/userinfo", (req, res) => {
  res.send("userinfo 삭제");
});

const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("./tokenFunction");

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let data = await User.findOne({
      where: {
        email: email,
        user_password: password,
      },
    });

    if (!data) {
      res.status(400).send({ data: null, message: "not Authorized" });
    }
    delete data.dataValues.user_password;
    let accessTk = generateAccessToken(data.dataValues);
    let refreshTk = generateRefreshToken(data.dataValues);

    sendRefreshToken(res, refreshTk);
    sendAccessToken(res, accessTk);
  } catch (error) {
    console.log(error);
  }
});

app.post("/users/logout", (req, res) => {
  if (!req.cookies.refreshToken)
    res.status(400).json({ data: null, message: "not authorized" });
  else {
    res.clearCookie("refreshToken");
    res.json({ data: null, message: "logout Success" });
  }
});

module.exports = app;
