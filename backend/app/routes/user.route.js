const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {requireAuth} = require("../middlewares/auth.middleware")
const {AdminOnly} = require("../middlewares/auth.middleware")

router.route("/login")
    .post(userController.login);

router.route("/add")
    .post(userController.create);

router.route("/")
    .get(requireAuth, userController.logout)

router.route("/forgot")
    .post(userController.forgotPass)

router.route("/username")
    .post(userController.get)

router.route("/all")
    .get(userController.getAll)

router.route("/username")
    .delete(userController.delete)

router.route("/username")
    .put(userController.update)

router.route("/cp/username")
    .put(userController.changePass);

/*router.route("/secret/:id")
    .get(userController.decodepass)*/

/*router.route("/find")
    .post(userController.findByEmailOrUsername);*/

module.exports = router;