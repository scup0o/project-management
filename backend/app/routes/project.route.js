const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.route('/:id')
    .get(projectController.get)
    .delete(projectController.delete)

router.route("/")
    .get(projectController.getAll)
    .delete(projectController.deleteAll)
    .put(projectController.update)
    .post(projectController.create);

router.route("/type/:type")
    .get(projectController.getType)
    

module.exports = router;