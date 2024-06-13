const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {requireAuth} = require("../middlewares/auth.middleware")
const {AdminOnly} = require("../middlewares/auth.middleware")

router.route("/login")
    .post(userController.login);

router.route("/add")
    .post(requireAuth, AdminOnly, userController.create);

router.route("/")
    .get(requireAuth, userController.logout)

router.route("/forgot")
    .post(userController.forgotPass)

router.route("/:id")
    .post(requireAuth, userController.get)

router.route("/all")
    .get(requireAuth, AdminOnly, userController.getAll)

router.route("/:id")
    .delete(requireAuth, AdminOnly, userController.delete)

router.route("/")
    .put(requireAuth, userController.update)

router.route("/cp")
    .put(userController.changePass);

/*router.route("/secret/:id")
    .get(userController.decodepass)*/

/*router.route("/find")
    .post(userController.findByEmailOrUsername);*/

module.exports = router;