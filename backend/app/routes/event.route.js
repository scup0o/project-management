const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.route("/").post(eventController.create).put(eventController.update);
router.route("/:id").get(eventController.get).delete(eventController.delete);

router.route("/da/:id_da").get(eventController.getAll);

module.exports = router;
