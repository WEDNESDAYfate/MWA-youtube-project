const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");

router.route("").post(usersController.register).put(usersController.login);

module.exports = router;
