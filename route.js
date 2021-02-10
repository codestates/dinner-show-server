const express = require("express");
const router = express.Router();

const contentController = require("./controllers/contents");
router.post("/contents", contentController.post);
router.get("/contents", contentController.get);
router.get("/contents/:id", contentController.getById);
router.get("/contents/search/:searchword", contentController.getBySearch);
router.post("/contents/update/:id", contentController.postUpdate);
router.post(
  "/contents/changeheartnum/:contentId",
  contentController.postChangeHeart
);
router.delete("/contents/:id", contentController.delete);

const commentController = require("./controllers/comments");
router.get("/comment/:contentId", commentController.get);
router.post("/comment", commentController.post);
router.post("/comment/:id", commentController.postUpdate);
router.delete("/comment/:id", commentController.delete);

const userinfoController = require("./controllers/userinfo");
router.post("/userinfo/signup", userinfoController.postSignup);
router.post("/userinfo/:id", userinfoController.postUpdate);
router.get("/userinfo/:id", userinfoController.get);
router.delete("/userinfo/:id", userinfoController.delete);

const toLoginController = require("./controllers/toLogin");
router.post("/users/login", toLoginController.postLogin);
router.get("/accesstokenrequest", toLoginController.getDataByToken);
router.get("/refreshtokenrequest", toLoginController.getDataByRtoken);
router.post("/users/logout", toLoginController.postLogout);

module.exports = router;
