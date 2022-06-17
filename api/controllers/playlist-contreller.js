const { channel } = require("diagnostics_channel");
const mongoose = require("mongoose");
const Channel = mongoose.model(process.env.DB_CHANNEL_MODEL);

const getAll = function (req, res) {
  const channelId = req.params.channelId;

  Channel.findById(channelId)
    .select("playlist")
    .exec(function (err, channel) {
      const response = { status: 200, message: [] };

      if (err) {
        console.log("Error finding channel");
        response.status = 500;
        response.message = err;
      } else if (!channel) {
        console.log("Channel not found");
        response.status = 404;
        response.message = { message: "Channel not found " };
      } else {
        response.message = channel.playlist;
      }
      res.status(response.status).json(response.message);
    });
};

const getOne = function (req, res) {
  const channelId = req.params.channelId;
  const playlistId = req.params.playlistId;

  Channel.findById(channelId)
    .select("playlist")
    .exec(function (err, channel) {
      const response = { status: 200, message: [] };
      if (err) {
        console.log("Error finding channel");
        response.status = 500;
        response.status = err;
      } else if (!channel || !channel.playlist.id(playlistId)) {
        console.log("Channel ID or playlist ID not found");
        response.status = 404;
        response.message = { message: "Channel ID or Playlist Id not found " };
      } else {
        response.message = channel.playlist.id(playlistId);
      }
      res.status(response.status).json(response.message);
    });
};

const addOne = function (req, res) {
  const channelId = req.params.channelId;
  Channel.findById(channelId)
    .select("playlist")
    .exec(function (err, channel) {
      const response = { status: 200, message: channel };

      if (err) {
        console.log("Error finding channel");
        response.status = 500;
        response.status = err;
      } else if (!channel) {
        console.log("Channel ID not foud");
        response.status = 404;
        response.message = { message: "Channel ID not foud" };
      }
      if (channel) {
        _addPlaylist(req, res, channel);
      } else {
        res.status(response.status).json(response.message);
      }
    });
};

const _addPlaylist = function (req, res, channel) {
  const newPlaylist = {
    title: req.body.title,
    numberOfVideos: req.body.numberOfVideos,
  };

  channel.playlist.push(newPlaylist);
  channel.save(function (err, updateChannel) {
    const response = { status: 200, message: [] };
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 201;
      response.message = updateChannel.playlist;
    }
    res.status(response.status).json(response.message);
  });
};

const deleteOne = function (req, res) {
  const channelId = req.params.channelId;
  Channel.findById(channelId)
    .select("playlist")
    .exec(function (err, channel) {
      const response = { status: 200, message: channel };

      if (err) {
        console.log("Error finding channel");
        response.status = 500;
        response.status = err;
      } else if (!channel) {
        console.log("Channel ID not foud");
        response.status = 404;
        response.message = { message: "Channel ID not foud" };
      }
      if (channel) {
        _deletePlaylist(req, res, channel);
      } else {
        res.status(response.status).json(response.message);
      }
    });
};

const _deletePlaylist = function (req, res, channel) {
  channel.playlist.id(req.params.playlistId).remove();

  channel.save(function (err, updateChannel) {
    const response = { status: 204, message: [] };
    if (err) {
      response.status = 500;
      response.message = err;
    } else {
      response.status = 201;
      response.message = updateChannel.playlist;
    }
    res.status(response.status).json(response.message);
  });
};

const _updateOne = function (req, res, playlistUpdateCallback) {
  console.log("Update One Playlist Controller");
  const channelId = req.params.channelId;
  Channel.findById(channelId)
    .select("playlist")
    .exec(function (err, channel) {
      console.log(
        "Found Playlist ",
        channel.playlist,
        " for Channel ",
        channel
      );
      const response = { status: 204, message: channel };
      if (err) {
        console.log("Error Finding channel");
        response.status = 500;
        response.message = err;
      } else if (!channel) {
        console.log("Channel with given ID not found");
        response.status = 404;
        response.message = { message: "Channel ID not found" };
      }
      if (response.status !== 204) {
        res.status(response.status).json(response.message);
      }
      playlistUpdateCallback(req, res, channel);
    });
};

const _fullPlayListUpdate = function (req, res, channel) {
  channel.playlist.id(req.params.playlistId).title = req.body.title;
  channel.playlist.id(req.params.playlistId).numberOfVideos =
    req.body.numberOfVideos;

  channel.save(function (err, updatedchannel) {
    const response = {
      status: 204,
      message: updatedchannel.playlist,
    };
    if (err) {
      response.status = 500;
      response.message = err;
    }
    res.status(response.status).json(response.message);
  });
};

const _partialPlayListUpdate = function (req, res, channel) {
  let playlist = channel.playlist.id(req.params.playlistId);
  if (req.body.title) {
    playlist.title = req.body.title;
  }
  if (req.body.numberOfVideos) {
    playlist.numberOfVideos = req.body.numberOfVideos;
  }

  channel.save(function (err, updatedchannel) {
    const response = { status: 204, message: updatedchannel.playlist };
    if (err) {
      response.status = 500;
      response.message = err;
    }
    res.status(response.status).json(response.message);
  });
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
