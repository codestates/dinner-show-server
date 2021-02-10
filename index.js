const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

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
const indexRouter = require("./route.js");
app.use("/", indexRouter);

app.get("/deploytest", async (req, res) => {
  console.log("ok");
  res.status(200).send("hello deploy");
});

app.listen(PORT, () => {
  console.log(`개발환경 : ${process.env.NODE_ENV}`);
  console.log(`server connect ${PORT}`);
});

module.exports = app;
