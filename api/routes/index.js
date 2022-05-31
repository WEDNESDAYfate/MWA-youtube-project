const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const channelsController = require("../controllers/channels.controller");
const playlistController = require("../controllers/playlist-contreller");

router
  .route("/channel")
  .get(channelsController.getAll)
  .post(channelsController.addOne);
router
  .route("/channel/:channelId")
  .get(channelsController.getOne)
  .delete(channelsController.deleteOne)
  .put(channelsController.fullUpdateOne)
  .patch(channelsController.partialUpdateOne);

router
  .route("/channel/:channelId/playlist")
  .get(playlistController.getAll)
  .post(playlistController.addOne);
router
  .route("/channel/:channelId/playlist/:playlistId")
  .get(playlistController.getOne)
  .delete(playlistController.deleteOne)
  .put(playlistController.fullUpdateOne)
  .patch(playlistController.partialUpdateOne);

module.exports = router;
