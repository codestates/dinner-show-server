const {
  content: Content,
  user: User,
  comment: Comment,
} = require("../models/index.js");
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = {
  post: (req, res) => {
    console.log("post content");
    const {
      userId = null,
      title,
      content,
      heart_number = 0,
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
        heart_number,
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
  },
  get: async (req, res) => {
    console.log("get All");
    let data = await Content.findAll();
    if (!data) {
      res.status(400).send({ message: "no content" });
    }
    res.status(200).send({ data: data, message: "ok" });
  },

  getById: async (req, res) => {
    console.log("get by Id");
    let data = await Content.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) {
      res.status(400).send({ data: null, message: "no contents" });
    }
    res.status(200).send({ data: data, message: "ok" });
  },
  getBySearch: async (req, res) => {
    console.log("get by search");
    let searchWord = req.params.searchword;
    try {
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
      res.status(200).send({ data: data, message: "ok" });
    } catch (err) {
      console.log(err);
      res.status(404).send({ message: "search fail" });
    }
  },
  postUpdate: async (req, res) => {
    console.log("post update contents");
    const {
      title,
      content,
      tag = null,
      location = null,
      img = null,
    } = req.body;
    if (!title || !content)
      return res.status(400).send({ message: "fill the required" });
    const data = await Content.findOne({ where: { id: req.params.id } });
    data.title = title;
    data.content = content;
    data.location = location;
    data.img = img;
    data.tag = tag;
    data.save();
    res.status(200).send({ data: data, message: "success update content" });
  },
  postChangeHeart: async (req, res) => {
    console.log("change heart num");
    const { heart } = req.body;
    if (heart === "plus") {
      let data = await Content.findOne({
        where: { id: req.params.contentId },
      });
      data.heart_number = data.heart_number + 1;
      data.save();
      res
        .status(200)
        .send({ data: data, message: "success increase heartNum" });
    } else if (heart === "minus") {
      let data = await Content.findOne({
        where: { id: req.params.contentId },
      });
      data.heart_number = data.heart_number - 1 < 0 ? 0 : data.heart_number - 1;
      data.save();
      res
        .status(200)
        .send({ data: data, message: "success decrease heartNum" });
    } else {
      res.status(400).send({ message: " plus or minus ???" });
    }
  },
  delete: (req, res) => {
    console.log("delete content");
    if (req.params.id) {
      Content.destroy({ where: { id: req.params.id } }).then(() => {
        res.status(200).send({ message: "delete data" });
      });
    } else {
      res.status(400).send({ data: null, message: "fail delete content" });
    }
  },
};
