const express = require("express");
const router = express.Router();
const doctypeController = require("../controllers/doctype.controller");

router
  .route("/:id")
  .get(doctypeController.get)
  .delete(doctypeController.delete);

router
  .route("/")
  .get(doctypeController.getAll)
  .delete(doctypeController.deleteAll)
  .put(doctypeController.update)
  .post(doctypeController.create);

router.route("/type/:type").get(doctypeController.getType);

module.exports = router;
