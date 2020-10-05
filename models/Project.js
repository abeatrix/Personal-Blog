const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
