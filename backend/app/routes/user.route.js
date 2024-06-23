const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {requireAuth} = require("../middlewares/auth.middleware")
const {AdminOnly} = require("../middlewares/auth.middleware")

router.route("/lock")
    .post(userController.lock);

router.route("/login")
    .post(userController.login);

router.route("/add")
    .post(requireAuth, AdminOnly, userController.create);

router.route("/")
    .get(requireAuth, userController.logout)
    .put(requireAuth, userController.update)

router.route("/forgot")
    .post(userController.forgotPass)

router.route("/:id")
    .post(requireAuth, userController.get)
    .delete(requireAuth, AdminOnly, userController.delete)

router.route("/all")
    .get(requireAuth, userController.getAll)

router.route("/cp")
    .put(userController.changePass);

router.route("/:manhanvien")
    .get(requireAuth, userController.getMSNV)

/*router.route("/secret/:id")
    .get(userController.decodepass)*/

/*router.route("/find")
    .post(userController.findByEmailOrUsername);*/

module.exports = router;