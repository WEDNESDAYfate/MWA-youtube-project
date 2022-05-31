const { create } = require("domain");
const { response } = require("express");
const { status } = require("express/lib/response");
const mongoose = require("mongoose");
const Channel = mongoose.model(process.env.DB_CHANNEL_MODEL);

const getAll = function (req, res) {
  console.log(process.env.DEFAULT_FIND_OFFSET);
  let offset = parseInt(
    process.env.DEFAULT_FIND_OFFSET,
    process.env.INTERGER_CONVERSION_BASE
  );
  let count = parseInt(
    process.env.DEFAULT_FIND_COUNT,
    process.env.INTERGER_CONVERSION_BASE
  );
  const maxCount = parseInt(
    process.env.DEFAULT_FIND_COUNT_MAX,
    process.env.INTERGER_CONVERSION_BASE
  );

  if (req.query.offset && req.query) {
    offset = parseInt(req.query.offset, process.env.INTERGER_CONVERSION_BASE);
  }

  if (req.query.offset && req.query) {
    count = parseInt(req.query.count, process.env.INTERGER_CONVERSION_BASE);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({ message: "QuiryString offset and count should be numbers" });
    return;
  }

  if (count > maxCount) {
    res.status(400).json({ message: "Cannot exceed count of " + maxCount });
    return;
  }

  Channel.find()
    .skip(offset)
    .limit(count)
    .exec(function (err, channels) {
      const response = { status: 200, message: channels };
      if (err) {
        console.log("Error finding channels", err);
        response.status = 500;
        response.message = err;
      }
      res.status(200).json(channels);
    });
};

const getOne = function (req, res) {
  const channelId = req.params.channelId;
  Channel.findById(channelId).exec(function (err, channel) {
    const response = { status: 200, message: channel };

    if (err) {
      console.log("Error find channel", channelId);
      response.status = 500;
      response.message = err;
    } else if (!channel) {
      console.log("Channel ID not  found", channelId);
      response.status = 400;
      response.message = { message: "Channel Id not found" };
    }
    res.status(response.status).json(response.message);
  });
};

const addOne = function (req, res) {
  const newChannel = {
    name: req.body.name,
    numberOfSubscribers: req.body.numberOfSubscribers,
    startYear: req.body.startYear,
    playlist: [],
  };

  Channel.create(newChannel, function (err, channel) {
    const response = { status: 201, message: channel };
    if (err) {
      console.log("Error creating channel");
      response.status = 500;
      response.message = err;
    }
    res.status(response.status).json(response.message);
  });
};

const deleteOne = function (req, res) {
  const channelId = req.params.channelId;

  Channel.findByIdAndDelete(channelId, function (err, deletedChannel) {
    const response = { status: 204, message: deletedChannel };

    if (err) {
      console.log("Error deleting  channel");
      response.status = 500;
      response.message = err;
    } else if (!deletedChannel) {
      console.log("Channel ID not  found");
      response.status = 404;
      response.message = { message: "Channel Id not found" };
    }
    res.status(response.status).json(response.message);
  });
};

const _updateOne = function (req, res, updateChannelCallback) {
  console.log("Update One channel");
  const channelId = req.params.channelId;
  Channel.findById(channelId).
    exec(function (err, channel) {
      const response = { status: 204, message: channel };
      if (err) {
        console.log("Error find game");
        response.status = 500;
        response.message = err;
      } else if (!channel) {
        console.log("Channel Id not found");
        response.status = 404;
        response.message = { message: "Channel Id not found" };
      }
      if (response.status !== 204) {
        res.status(response.status).json(response.message);
      } else {
        updateChannelCallback(req, res, channel, response);
      }
    });
};
const fullUpdateOne = function (req, res) {
  console.log("Full Update One Channel Controller");
  channelUpdate = function (req, res, channel, response) {
    channel.name = req.body.name;
    channel.numberOfSubscribers = req.body.numberOfSubscribers;
    channel.startYear = req.body.startYear;

    
    channel.save(function (err, updatedchannel) {
      if (err) {
        response.status = 500;
        response.message = err;
      }
      res.status(response.status).json(response.message);
    });
  };
  _updateOne(req, res, channelUpdate);
};

const partialUpdateOne = function (req, res) {
  console.log("Full Update One Channal Controller");
  channelUpdate = function (req, res, channel, response) {
    if (req.body.name) {
      channel.name = req.body.name;
    }
    if (req.body.numberOfSubscribers) {
      channel.numberOfSubscribers = req.body.numberOfSubscribers;
    }
    if (req.body.startYear) {
      channel.startYear = req.body.startYear;
    }

    channel.save(function (err, updatedchannel) {
      if (err) {
        response.status = 500;
        response.message = err;
      }
      res.status(response.status).json(response.message);
    });
  };
  _updateOne(req, res, channelUpdate);
};
module.exports = {
  fullUpdateOne: fullUpdateOne,
  partialUpdateOne: partialUpdateOne,
};

module.exports = {
  getAll,
  getOne,
  addOne,
  deleteOne,
  _updateOne,
  fullUpdateOne,
  partialUpdateOne,
};
