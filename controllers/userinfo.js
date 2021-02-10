const {
  content: Content,
  user: User,
  comment: Comment,
} = require("../models/index.js");

module.exports = {
  postSignup: (req, res) => {
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
  },
  postUpdate: async (req, res) => {
    console.log("post update userinfo");
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
  },
  get: async (req, res) => {
    const data = await User.findOne({ where: { id: req.params.id } });
    res.status(200).send({ data: data, message: "bring userinfo" });
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
