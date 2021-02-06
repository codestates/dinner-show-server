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
    origin: "*",
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

app.post("/contents", (req, res) => {
  const {
    userId = null,
    title,
    content,
    tag = null,
    img = null,
    location = null,
  } = req.body;
  if (!title || !content) {
    res.status(400).send({ message: "fill the content and title" });
  } else {
    Content.build({
      title,
      content,
      tag,
      img,
      location,
      userId,
    })
      .save()
      .then(function (newContent) {
        res.status(200).send({ message: "post content success" });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

app.get("/contents", async (req, res) => {
  let data = await Content.findAll();
  res.status(200).send({ data: data, message: "ok" });
});

app.get("/contents/:id", async (req, res) => {
  let data = await Content.findAll({
    where: {
      id: req.params.id,
    },
  });
  if (!data) {
    res.status(400).send({ data: null, message: "no contents" });
  }
  res.status(200).send(data);
});

app.post("/contents/update/:id", async (req, res) => {
  const { title, content, location = null, img = null } = req.body;
  if (!title || !content)
    return res.status(400).send({ message: "fill the required" });
  const data = await Content.findOne({ where: { id: req.params.id } });
  data.title = title;
  data.content = content;
  data.location = location;
  data.img = img;
  data.save();
  res.status(200).send({ data: data, message: "success update content" });
});

app.post("/contents/changeheartnum/:contentId", async (req, res) => {
  const { heart } = req.body;
  if (heart === "plus") {
    let data = await Content.findOne({ where: { id: req.params.contentId } });
    data.heart_number = data.heart_number + 1;
    data.save();
    res.status(200).send({ data: data, message: "success increase heartNum" });
  } else if (heart === "minus") {
    let data = await Content.findOne({ where: { id: req.params.contentId } });
    data.heart_number = data.heart_number - 1 < 0 ? 0 : data.heart_number - 1;
    data.save();
    res.status(200).send({ data: data, message: "success decrease heartNum" });
  }
  res.status(400).send({ message: " plus or minus ???" });
});

app.delete("/contents/:id", (req, res) => {
  if (req.params.id) {
    Content.destroy({ where: { id: req.params.id } }).then(() => {
      res.status(200).send({ message: "delete data" });
    });
  } else {
    res.status(400).send({ data: null, message: "fail delete content" });
  }
});

const sequelize = require("sequelize");
const Op = sequelize.Op;

app.get("/contents/search/:text", async (req, res) => {
  console.log(req.params.text);
  let searchWord = req.params.text;
  const data = await Content.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: "%" + searchWord + "%",
        },
        content: {
          [Op.like]: "%" + searchWord + "%",
        },
        tag: {
          [Op.like]: "%" + searchWord + "%",
        },
      },
    },
  });

  res.send({ data: data, message: "" });
});

app.post("/comment", async (req, res) => {
  const { contentId, name = "비회원", text } = req.body;
  if (!contentId || !text)
    return res.status(400).send({ message: "fill the contentId or text" });
  try {
    let data = await Comment.create({
      contentId,
      name,
      text,
    });
    res.status(200).send({ data: data, message: "post comment success" });
  } catch (err) {
    console.log(err);
  }
});
app.get("/comment/:contentId", async (req, res) => {
  const data = await Comment.findAll({
    where: {
      contentId: req.params.contentId,
    },
  });
  res.status(200).send({ data: data, message: "get comments" });
});

app.post("/comment/:id", async (req, res) => {
  const { name = "비회원", text } = req.body;
  if (!text) {
    return res.status(400).send({ message: "filled the required" });
  }
  const data = await Comment.findOne({ where: { id: req.params.id } });
  data.name = name;
  data.text = text;
  await data.save();
  res.status(200).send({ data: data, message: "success update comment" });
});

app.delete("/comment/:id", (req, res) => {
  if (req.params.id) {
    Comment.destroy({ where: { id: req.params.id } }).then((data) => {
      if (data === 0)
        return res.status(400).send({ message: "fail delete comment" });
      res.status(200).send({ message: "delete comment data" });
    });
  } else {
    res.status(400).send({ data: null, message: "fail delete comment" });
  }
});

app.post("/users/signup", async (req, res) => {
  const {
    user_password,
    full_name,
    birth = null,
    sex = null,
    email,
    phone_number = null,
  } = req.body;
  if (!user_password || !full_name || !email) {
    return res.status(400).send({ message: "filled the required" });
  }
  User.create({
    user_password,
    full_name,
    birth,
    sex,
    email,
    phone_number,
  })
    .then((data) => {
      res.status(200).send({ data: data, message: "success signup" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/userinfo/:id", async (req, res) => {
  const data = await User.findOne({ where: { id: req.params.id } });
  res.status(200).send({ data: data, message: "bring userinfo" });
});

app.post("/userinfo/:id", async (req, res) => {
  const {
    user_password,
    full_name,
    email,
    birth = null,
    sex = null,
    phone_number = null,
  } = req.body;
  if (!user_password || !full_name || !email) {
    return res.status(400).send({ message: "filled the required" });
  }
  const data = await User.findOne({ where: { id: req.params.id } });
  data.user_password = user_password;
  data.full_name = full_name;
  data.email = email;
  data.birth = birth;
  data.sex = sex;
  data.phone_number = phone_number;
  await data.save();
  res.send({ data: data, message: "success update userinfo" });
});

app.delete("/userinfo/:id", (req, res) => {
  if (req.params.id) {
    User.destroy({ where: { id: req.params.id } }).then((data) => {
      if (data === 0)
        return res.status(400).send({ message: "fail delete userinfo" });
      res.status(200).send({ message: "delete userinfo" });
    });
  } else {
    res.status(400).send({ data: null, message: "fail delete userinfo" });
  }
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
