const {
  content: Content,
  user: User,
  comment: Comment,
} = require("../models/index.js");
module.exports = {
  get: async (req, res) => {
    const data = await Comment.findAll({
      where: {
        contentId: req.params.contentId,
      },
    });
    res.status(200).send({ data: data, message: "get comments" });
  },
  post: async (req, res) => {
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
  },
  postUpdate: async (req, res) => {
    const { name = "비회원", text } = req.body;
    if (!text) {
      return res.status(400).send({ message: "filled the required" });
    }
    const data = await Comment.findOne({ where: { id: req.params.id } });
    data.name = name;
    data.text = text;
    await data.save();
    res.status(200).send({ data: data, message: "success update comment" });
  },
  delete: (req, res) => {
    if (req.params.id) {
      Comment.destroy({ where: { id: req.params.id } }).then((data) => {
        if (data === 0)
          return res.status(400).send({ message: "fail delete comment" });
        res.status(200).send({ message: "delete comment data" });
      });
    } else {
      res.status(400).send({ message: "fail delete comment" });
    }
  },
};
