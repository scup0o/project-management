const express = require("express");
const router = express.Router();
const doctypeController = require("../controllers/doctype.controller");

router
  .route("/:id")
  .get(doctypeController.get)
  .delete(doctypeController.delete);

router.route("/").put(doctypeController.update).post(doctypeController.create);

router.route("/type/:type").get(doctypeController.getType);
router.route("/all/:type").get(doctypeController.getAll);
router.route("/dA/:type").delete(doctypeController.deleteAll);

module.exports = router;
