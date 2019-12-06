const express = require("express");
const project = require("../data/helpers/projectModel");
const action = require("../data/helpers/actionModel");

const router = express.Router();

// GET for projects.
router.get("/:id", validateProjectId, (req, res) => {
  const projectData = req.params.id;
  console.log(projectData);
  project
    .get(projectData)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ mesage: "Error retrieving the projects. " });
    });
});

// GET for actions.
router.get("/:id/actions", validateProjectId, (req, res) => {
  const id = req.params.id;
  project
    .getProjectActions(id)
    .then(actions => {
      actions
        ? res.status(200).json(actions)
        : res
            .status(400)
            .json({ message: "The project does not contain any actions." });
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "Failed to retrieve the actions for the project." });
    });
});

// router.get("/", (req, res) => {
//   res.status(200).json({ message: "hello" });
// });

router.post("/", validateProject, (req, res) => {
  const projectData = req.body;
  project
    .insert(projectData)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error creating the project." });
    });
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

function validateProjectId(req, res, next) {
  const id = req.params.id;
  project
    .get(id)
    .then(id => {
      id
        ? next()
        : res.status(400).json({ message: "Project ID does not exist." });
    })
    .catch(error => {
      console.log(error);
    });
}

function validateProject(req, res, next) {
  const projectData = req.body;
  if (!projectData.name || !projectData.description) {
    res.status(400).json({
      message: "Please provide a name and description for the project."
    });
  } else {
    next();
  }
}

module.exports = router;
