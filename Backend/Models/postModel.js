const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: "posts",
});

postSchema.statics.createPost = async function (title, content) {
  try {
    const post = new this({ title, content });
    return await post.save();
  } catch (error) {
    throw error;
  }
};

postSchema.statics.getAllPosts = async function () {
  try {
    return await this.find();
  } catch (error) {
    throw error;
  }
};

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
