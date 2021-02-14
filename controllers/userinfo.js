const {
  content: Content,
  user: User,
  comment: Comment,
} = require("../models/index.js");
const bcrypt = require("bcrypt");
const saltRounds = 9;

module.exports = {
  postSignup: async (req, res) => {
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

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user_password, salt, function (err, hash) {
        User.create({
          user_password: hash,
          full_name,
          birth,
          sex,
          email,
          phone_number,
          salt,
        })
          .then((data) => {
            res.status(200).send({ data: data, message: "success signup" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  },
  postUpdate: async (req, res) => {
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
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user_password, salt, async function (err, hash) {
        data.user_password = hash;
        data.full_name = full_name;
        data.email = email;
        data.birth = birth;
        data.sex = sex;
        data.phone_number = phone_number;
        data.salt = salt;
        await data.save();
        res.send({
          data: {
            id: data.id,
            user_password: data.user_password,
            full_name: data.full_name,
            birth: data.birth,
            sex: data.sex,
            email: data.email,
            phone_number: data.phone_number,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
          message: "success update userinfo",
        });
      });
    });
  },
  get: async (req, res) => {
    const data = await User.findOne({ where: { id: req.params.id } });
    res.status(200).send({
      data: {
        id: data.id,
        user_password: data.user_password,
        full_name: data.full_name,
        birth: data.birth,
        sex: data.sex,
        email: data.email,
        phone_number: data.phone_number,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      message: "bring userinfo",
    });
  },
  delete: (req, res) => {
    if (req.params.id) {
      User.destroy({ where: { id: req.params.id } }).then((data) => {
        if (data === 0)
          return res.status(400).send({ message: "fail delete userinfo" });
        res.status(200).send({ message: "delete userinfo" });
      });
    } else {
      res.status(400).send({ data: null, message: "fail delete userinfo" });
    }
  },
};
