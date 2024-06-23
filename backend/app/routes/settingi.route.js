const express = require("express");
const router = express.Router();
const settingiController = require("../controllers/settingi.controller");

router
  .route("/:id")
  .delete(settingiController.delete)
  .get(settingiController.get);

router
  .route("/")
  .put(settingiController.update)
  .post(settingiController.create)

  router.route("/all/:id")
  .get(settingiController.getAll);

  router.route("/server/update").put(settingiController.updateServer)
  router.route("/server/delete/:id").delete(settingiController.deleteServer)
  //router.route("/server/add").post(settingiController.addServer)

module.exports = router;
