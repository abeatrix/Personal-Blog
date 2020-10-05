/* IMPORTS */
const router = require("express").Router()
const db = require("../models");

// base route is /projects

// INDEX VIEW
router.get("/", function (req, res) {
  db.Project.find({}, function (error, foundProjects) {
    if (error) return res.send(error);

    const context = {
      projects: foundProjects,
    };

    res.render("project/index", context);
  });
});

// NEW VIEW
router.get("/new", function (req, res) {
  db.Author.find({}, function (err, foundAuthors) {
    if (err) return res.send(err);

    const context = {
      authors: foundAuthors,
    };

    res.render("project/new", context);
  });
});

// CREATE ROUTE
router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const createdProject = await db.Project.create(req.body);
    const foundAuthor = await db.Author.findById(req.body.author);

    foundAuthor.project.push(createdProject);
    await foundAuthor.save();

    res.redirect('/');

  } catch (err){
    console.log(err);
    res.send({message: 'Internal server error'})
  }

});

// SHOW VIEW
router.get("/:id", function (req, res) {
  db.Project.findById(req.params.id, function (err, foundProject) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { project: foundProject };
    res.render("project/show", context);
  });
});

// EDIT ROUTE
router.get("/:id/edit", function (req, res) {
  db.Project.findById(req.params.id, function (err, foundProject) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { project: foundProject };
    res.render("project/edit", context);
  });
});

// DELETE ROUTE
router.put("/:id", function (req, res) {
  db.Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    function (err, updatedProject) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect(`/project/${updatedProject._id}`);
    }
  );
});

// delete
// TODO refactor to delete project and project from author
router.delete("/:id", function (req, res) {
  db.Project.findByIdAndDelete(req.params.id, function (err, deletedProject) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    db.Author.findById(deletedProject.author, function(err, foundAuthor) {
      if(err){
        console.log(err);
        return res.send(err);
      }

      foundAuthor.projects.remove(deletedProject);
      foundAuthor.save();

      res.redirect("/");
    })
  });
});

module.exports = router;
