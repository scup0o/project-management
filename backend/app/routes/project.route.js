const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router
  .route("/:id")
  .get(projectController.get)
  .delete(projectController.delete)
  .put(projectController.archive);

router
  .route("/")
  .delete(projectController.deleteAll)
  .put(projectController.update)
  .post(projectController.create);

router.route("/type/:type").post(projectController.getType);

router.route("/all/:type").get(projectController.getAll);

router.route("/:da").post(projectController.getQuyen);

router.route("/tb/tat/:id").put(projectController.tat);
router.route("/tb/bat/:id").put(projectController.bat);

module.exports = router;
