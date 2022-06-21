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

const _nameSearch = function (req, res) {
  const name = req.query.search;
  const query = {
    name: { $regex: name, $options: "i" },
  };
  const response = {
    status: process.env.REST_API_OK,
    message: {},
  };

  Channel.find(query)
    .exec()
    .then((channels) => _getSuccess(channels, response))
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const getAll = function (req, res) {
  if (req.query && req.query.search) {
    _nameSearch(req, res);
    return;
  }

  const response = { status: process.env.REST_API_OK, message: {} };

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

  if (req.query.count && req.query) {
    count = parseInt(req.query.count, process.env.INTERGER_CONVERSION_BASE);
  }

  if (isNaN(offset) || isNaN(count)) {
    _userError(
      { message: "QuiryString offset and count should be numbers" },
      response
    );
    _sendResponse(res, response);
    return;
  }

  if (count > maxCount) {
    _userError({ message: "Cannot exceed count of " + maxCount }, response);
    _sendResponse(res, response);
    return;
  }

  Channel.find()
    .skip(offset)
    .limit(count)
    .then((channels) => _getSuccess(channels, response))
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const getOne = function (req, res) {
  const channelId = req.params.channelId;
  const response = { status: process.env.REST_API_OK, message: {} };

  Channel.findById(channelId)
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
      } else {
        _getSuccess(channel, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const addOne = function (req, res) {
  const newChannel = {
    name: req.body.name,
    numberOfSubscribers: req.body.numberOfSubscribers,
    startYear: req.body.startYear,
    playlist: [],
  };
  const response = { status: process.env.REST_API_CREATED, message: {} };

  Channel.create(newChannel)
    .then((channel) => _addSuccess(channel, response))
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const deleteOne = function (req, res) {
  const channelId = req.params.channelId;
  const response = { status: process.env.REST_API_NOCONTENT, message: {} };

  Channel.findByIdAndDelete(channelId)
    .then((deletedChannel) => {
      if (!deletedChannel) {
        _notFoundError({ message: "Channel Id not found" }, response);
      } else {
        _deleteSuccess(deletedChannel, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const _updateOne = function (req, res, updateChannelCallback) {
  const channelId = req.params.channelId;
  const response = { status: process.env.REST_API_NOCONTENT, message: {} };

  Channel.findById(channelId)
    .exec()
    .then((channel) => {
      if (!channel) {
        _notFoundError({ message: "Channel Id not found" }, response);
        return;
      } else {
        return updateChannelCallback(req, channel);
      }
    })
    .then((updatedChannel) => {
      if (updatedChannel) {
        _updateSuccess(updatedChannel, response);
      }
    })
    .catch((error) => _systemError(error, response))
    .finally(() => _sendResponse(res, response));
};

const fullUpdateOne = function (req, res) {
  console.log("Full Update One Channel Controller");
  channelUpdate = function (req, channel) {
    channel.name = req.body.name;
    channel.numberOfSubscribers = req.body.numberOfSubscribers;
    channel.startYear = req.body.startYear;

    return channel.save();
  };
  _updateOne(req, res, channelUpdate);
};

const partialUpdateOne = function (req, res) {
  console.log("Full Update One Channal Controller");
  channelUpdate = function (req, channel) {
    if (req.body.name) {
      channel.name = req.body.name;
    }
    if (req.body.numberOfSubscribers) {
      channel.numberOfSubscribers = req.body.numberOfSubscribers;
    }
    if (req.body.startYear) {
      channel.startYear = req.body.startYear;
    }

    return channel.save();
  };
  _updateOne(req, res, channelUpdate);
};

module.exports = {
  getAll,
  getOne,
  addOne,
  deleteOne,
  fullUpdateOne,
  partialUpdateOne,
};
