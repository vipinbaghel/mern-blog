const mongoose = require("mongoose");
// const User = require('./User');
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: String,
    content: String,
    cover: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User", // references the user collection
    },

    //trim: true // it removes white spaces from a field's value
  },
  { timestamps: true }
);

//timestamps option is used to store createdat and updated at.

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
