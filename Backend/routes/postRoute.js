const express = require("express");
const router = express.Router();
const { createPost, getAllPosts } = require("../Models/postModel");

router.get("/", (req, res) => {
  res.send("Hello post page");
  getAllPosts(req, res);
});
router.post("/", (req, res) => {
  res.send("we get post request");
  createPost(req, res);
});

// export router
module.exports = router;
