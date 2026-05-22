const postModel = require("../model/PostModel");

const createpost = async (req, res) => {
  // Create a post from the request body and return JSON or a server error.
  const { title, content } = req.body;
  try {
    const post = await postModel.createPost(title, content);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getallpost = async (req, res) => {
  // Get all posts and return JSON or a server error.
  try {
    const posts = await postModel.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createpost,
  getallpost,
};
