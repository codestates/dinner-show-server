const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const app = express();
const HTTPS_PORT = process.env.HTTPS_PORT || 5000;

dotenv.config();
app.use(
  cors({
    origin: [
      "'http://dinner-show-client.s3-website.ap-northeast-2.amazonaws.com'",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT"],
  })
);

app.get("/deploytest", (req, res) => {
  res.status(200).json({ message: "hello world" });
});

app.listen(HTTPS_PORT, () => {
  console.log("server connect ");
});

module.exports = app;
