const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  },
  {
    timestamps: true,
    createdAt: "publishedAt",
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
