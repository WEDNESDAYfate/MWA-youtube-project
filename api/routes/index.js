const express = require("express");
const router = express.Router();
const channelRoutes = require("./channels");
const userRoutes = require("./user");

router.use("/channel", channelRoutes);
router.use("/users", userRoutes);

module.exports = router;
