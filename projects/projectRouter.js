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

// router.get("/", (req, res) => {
//   res.status(200).json({ message: "hello" });
// });

// POST for projects.
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

// PUT for projects.
router.put("/:id", validateProjectId, validateProject, (req, res) => {
  const projectData = req.body;
  const id = req.params.id;

  project
    .update(id, projectData)
    .then(project => {
      project
        ? res.status(200).json({ ...project, ...projectData })
        : res.status(404).json({ message: "The project could not be found." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error updating the project." });
    });
});

// DELETE for projects.
router.delete("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;
  project
    .remove(id)
    .then(project => {
      project > 0
        ? res.status(200).json({ message: "The project has been removed!" })
        : res.status(404).json({
            message: "The project with the specified ID does not exist."
          });
    })
    .catch(error => {
      res.status(500).json({ message: "The project could not be removed." });
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

// POST for actions
router.post("/:id/actions", (req, res) => {
  const id = req.params.id;
  const projectData = req.body;
  project
    .get(id)
    .then(project => {
      project
        ? action
            .insert(projectData)
            .then(action => {
              res.status(201).json(action);
            })
            .catch(error => {
              res.status(500).json({ message: "Could not create action." });
            })
        : res.status(404).json({
            message: "The project with the specified ID does not exist. "
          });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "There was an error saving the action." });
    });
});

router.put("/:id/actions", (req, res) => {
  const id = req.params.id;
  const projectData = req.body;
  project
    .get(id)
    .then(project => {
      project
        ? action
            .update(id, projectData)
            .then(action => {
              action
                ? res.status(200).json({ ...action, ...projectData })
                : res
                    .status(404)
                    .json({ message: "The action could not be found. " });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ message: "Could not update action." });
            })
        : res.status(404).json({
            message: "The project with the specified ID does not exist."
          });
    })
    .catch(error => {
      res.status(500).json({ message: "Could not update the action. " });
    });
});

// CUSTOM MIDDLEWARE

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
// function validateAction(req, res, next) {
//     const actionData = req.body;
// }

module.exports = router;
