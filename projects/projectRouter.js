const express = require("express");
const project = require("../data/helpers/projectModel");
const action = require("../data/helpers/actionModel");

const router = express.Router();

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

router.get("/", (req, res) => {
  res.status(200).json({ message: "hello" });
});

router.post("/", (req, res) => {});

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

module.exports = router;