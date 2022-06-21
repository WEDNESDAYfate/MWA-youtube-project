const express = require("express");
const router = express.Router();
const channelsController = require("../controllers/channels.controller");
const playlistController = require("../controllers/playlist-contreller");
const authController = require("../controllers/authentication.controller");

router
  .route("")
  .get(channelsController.getAll)
  .post(authController.authenticate, channelsController.addOne);
router
  .route("/:channelId")
  .get(channelsController.getOne)
  .delete(authController.authenticate, channelsController.deleteOne)
  .put(authController.authenticate, channelsController.fullUpdateOne)
  .patch(authController.authenticate, channelsController.partialUpdateOne);

router
  .route("/:channelId/playlist")
  .get(playlistController.getAll)
  .post(authController.authenticate, playlistController.addOne);
router
  .route("/:channelId/playlist/:playlistId")
  .get(playlistController.getOne)
  .delete(authController.authenticate, playlistController.deleteOne)
  .put(authController.authenticate, playlistController.fullUpdateOne)
  .patch(authController.authenticate, playlistController.partialUpdateOne);

module.exports = router;
