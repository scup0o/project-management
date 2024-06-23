const express = require("express");
const router = express.Router();
const settingiController = require("../controllers/settingi.controller");

router
  .route("/:id")
  .delete(settingiController.delete)

router
  .route("/")
  .put(settingiController.update)
  .post(settingiController.create);

router.route("/all/:id").get(settingiController.getAll);

//server route
router.route("/server/update").put(settingiController.updateServer);
router.route("/server/delete/:id").delete(settingiController.deleteServer);
//router.route("/server/add").post(settingiController.addServer)

//diary route
router.route("/diary/add").post(settingiController.addDiary);
router.route("/diary/get/:id").get(settingiController.getDiary);
router.route("/diary/update").put(settingiController.updateDiary);
router.route("/diary/delete/:id").delete(settingiController.deleteDiary);

module.exports = router;
