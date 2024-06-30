const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file.controller");

router.route("/upload/:filename").post(fileController.upload);

router.route("/:id").delete(fileController.delete);

router.route("/update/").put(fileController.update)
router.route("/").post(fileController.create);
router.route("/doc/").post(fileController.get);
router.route("/file/export/:id").get(fileController.exportData);

module.exports = router;
