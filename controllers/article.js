/* IMPORTS */
const router = require("express").Router()
const db = require("../models");

// base route is /articles

// INDEX VIEW
router.get("/", function (req, res) {
  db.Article.find({}, function (error, foundArticles) {
    if (error) return res.send(error);

    const context = {
      articles: foundArticles,
    };

    res.render("article/index", context);
  });
});

// NEW VIEW
router.get("/new", function (req, res) {
  db.Author.find({}, function (err, foundAuthors) {
    if (err) return res.send(err);

    const context = {
      authors: foundAuthors,
    };

    res.render("article/new", context);
  });
});

// CREATE ROUTE
router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const createdArticle = await db.Article.create(req.body);
    const foundAuthor = await db.Author.findById(req.body.author);

    foundAuthor.articles.push(createdArticle);
    await foundAuthor.save();

    res.redirect('/articles');

  } catch (err){
    console.log(err);
    res.send({message: 'Internal server error'})
  }

});

// SHOW VIEW
router.get("/:id", function (req, res) {
  db.Article.findById(req.params.id, function (err, foundArticle) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { article: foundArticle };
    res.render("article/show", context);
  });
});

// EDIT ROUTE
router.get("/:id/edit", function (req, res) {
  db.Article.findById(req.params.id, function (err, foundArticle) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { article: foundArticle };
    res.render("article/edit", context);
  });
});

// DELETE ROUTE
router.put("/:id", function (req, res) {
  db.Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    function (err, updatedArticle) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect(`/articles/${updatedArticle._id}`);
    }
  );
});

// delete
// TODO refactor to delete article and remove article from author
router.delete("/:id", function (req, res) {
  db.Article.findByIdAndDelete(req.params.id, function (err, deletedArticle) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    db.Author.findById(deletedArticle.author, function(err, foundAuthor) {
      if(err){
        console.log(err);
        return res.send(err);
      }

      foundAuthor.articles.remove(deletedArticle);
      foundAuthor.save();

      res.redirect("/articles");
    })
  });
});

module.exports = router;
