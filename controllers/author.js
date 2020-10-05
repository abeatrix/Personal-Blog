/* IMPORTS */
const router = require("express").Router()
const db = require("../models");

// base route is /profile

// INDEX VIEW
router.get("/", function (req, res) {
  db.Author.find({}, function (error, foundAuthors) {
    if (error) return res.send(error);

    const context = {
      authors: foundAuthors,
    };

    res.render("author/index", context);
  });
});

// NEW VIEW
router.get("/new", function (req, res) {
  res.render("author/new");
});

// CREATE ROUTE
router.post("/", function (req, res) {
  //mongoose
  db.Author.create(req.body, function (err, createdAuthor) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    res.redirect("/");
  });
});

// SHOW VIEW
router.get("/:id", function (req, res) {
  db.Author.findById(req.params.id)
    .populate("articles")
    .exec(function (err, foundAuthor) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { author: foundAuthor };
      res.render("author/show", context);
    });
});

// EDIT ROUTE
router.get("/:id/edit", function (req, res) {
  db.Author.findById(req.params.id, function (err, foundAuthor) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { author: foundAuthor };
    res.render("author/edit", context);
  });
});

// UPDATE ROUTE
router.put("/:id", function (req, res) {
  db.Author.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (
    err,
    updatedAuthor
  ) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    res.redirect(`/profile/${updatedAuthor._id}`);
  });
});

// DELETE ROUTE
// TODO refactor to mass delete all articles
router.delete("/:id", function (req, res) {
  db.Author.findByIdAndDelete(req.params.id, function (err, deletedAuthor) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    db.Article.remove({author: deletedAuthor._id}, function(err, removedArticles) {
      if(err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect("/profile");
    });
  });
});

module.exports = router;
