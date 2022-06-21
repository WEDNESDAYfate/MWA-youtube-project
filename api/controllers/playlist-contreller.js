const mongoose = require("mongoose");
const Channel = mongoose.model(process.env.DB_CHANNEL_MODEL);

const _sendResponse = function (res, response) {
  res
    .status(parseInt(response.status, process.env.INTERGER_CONVERSION_BASE))
    .json(response.message);
};

const _systemError = function (err, response) {
  response.status = process.env.REST_API_SYSTEM_ERROR;
  response.message = err;
};

const _userError = function (err, response) {
  response.status = process.env.REST_API_BAD_REQUEST;
  response.message = err;
};

const _notFoundError = function (err, response) {
  response.status = process.env.REST_API_NOTFOUND;
  response.message = err;
};

const _getSuccess = function (channel, response) {
  response.status = process.env.REST_API_OK;
  response.message = channel;
};

const _addSuccess = function (channel, response) {
  response.status = process.env.REST_API_CREATED;
  response.message = channel;
};

const _updateSuccess = function (channel, response) {
  response.status = process.env.REST_API_NOCONTENT;
  response.message = channel;
};

const _deleteSuccess = function (channel, response) {
  response.status = process.env.REST_API_NOCONTENT;
  response.message = channel;
};

const getAll = function (req, res) {
  const channelId = req.params.channelId;
  const response = { status: process.env.REST_API_OK, message: {} };

  Channel.findById(channelId)
    .select("playlist")
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
      } else {
        _getSuccess(channel.playlist, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const getOne = function (req, res) {
  const channelId = req.params.channelId;
  const playlistId = req.params.playlistId;
  const response = { status: process.env.REST_API_OK, message: {} };

  Channel.findById(channelId)
    .select("playlist")
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
      } else if (!channel.playlist.id(playlistId)) {
        _notFoundError({ message: "Playlist Id not found" }, response);
      } else {
        _getSuccess(channel.playlist.id(playlistId), response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const addOne = function (req, res) {
  const channelId = req.params.channelId;
  const response = { status: process.env.REST_API_CREATED, message: {} };

  Channel.findById(channelId)
    .select("playlist")
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
        return;
      } else {
        return _addPlaylist(req, channel);
      }
    })
    .then((updatedChannel) => {
      if (updatedChannel) {
        _addSuccess(updatedChannel.playlist, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const _addPlaylist = function (req, channel) {
  const newPlaylist = {
    title: req.body.title,
    numberOfVideos: req.body.numberOfVideos,
  };

  channel.playlist.push(newPlaylist);
  return channel.save();
};

const deleteOne = function (req, res) {
  const channelId = req.params.channelId;
  const playlistId = req.params.playlistId;
  const response = { status: process.env.REST_API_NOCONTENT, message: {} };

  Channel.findById(channelId)
    .select("playlist")
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
        return;
      } else if (!channel.playlist.id(playlistId)) {
        _notFoundError({ message: "Playlist Id not found" }, response);
        return;
      } else {
        return _deletePlaylist(req, channel);
      }
    })
    .then((updatedChannel) => {
      if (updatedChannel) {
        _deleteSuccess(updatedChannel.playlist, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const _deletePlaylist = function (req, channel) {
  channel.playlist.id(req.params.playlistId).remove();
  return channel.save();
};

const _updateOne = function (req, res, playlistUpdateCallback) {
  console.log("Update One Playlist Controller");
  const channelId = req.params.channelId;
  const playlistId = req.params.playlistId;
  const response = { status: process.env.REST_API_NOCONTENT, message: {} };

  Channel.findById(channelId)
    .select("playlist")
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
        return;
      } else if (!channel.playlist.id(playlistId)) {
        _notFoundError({ message: "Playlist Id not found" }, response);
        return;
      } else {
        return playlistUpdateCallback(req, channel);
      }
    })
    .then((updatedChannel) => {
      if (updatedChannel) {
        _updateSuccess(updatedChannel.playlist, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const _fullPlayListUpdate = function (req, channel) {
  channel.playlist.id(req.params.playlistId).title = req.body.title;
  channel.playlist.id(req.params.playlistId).numberOfVideos =
    req.body.numberOfVideos;

  return channel.save();
};

const _partialPlayListUpdate = function (req, channel) {
  let playlist = channel.playlist.id(req.params.playlistId);
  if (req.body.title) {
    playlist.title = req.body.title;
  }
  if (req.body.numberOfVideos) {
    playlist.numberOfVideos = req.body.numberOfVideos;
  }

  return channel.save();
};

const fullUpdateOne = function (req, res) {
  console.log("Full Update One", req.body);
  _updateOne(req, res, _fullPlayListUpdate);
};

const partialUpdateOne = function (req, res) {
  console.log("Partial Update One", req.body);
  _updateOne(req, res, _partialPlayListUpdate);
};

module.exports = {
  getAll,
  getOne,
  addOne,
  deleteOne,
  fullUpdateOne,
  partialUpdateOne,
};
