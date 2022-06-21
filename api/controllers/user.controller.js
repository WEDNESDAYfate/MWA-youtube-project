const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response, Router } = require("express");
const User = mongoose.model(process.env.DB_USER_MODEL);

const _sendResponse = function (res, response) {
  res
    .status(parseInt(response.status, process.env.INTERGER_CONVERSION_BASE))
    .json(response.message);
};

const _generateHash = function (password, saltValue) {
  return bcrypt.hash(password, saltValue);
};

const _createUser = function (name, username, password) {
  const newUser = {
    name: name,
    username: username,
    password: password,
  };
  return User.create(newUser);
};

const register = function (req, res) {
  const response = {
    status: process.env.REST_API_OK,
    message: [],
  };

  if (req.body && req.body.username && req.body.password) {
    const numberOfRounds = 10;
    bcrypt
      .genSalt(numberOfRounds)
      .then((saltValue) => _generateHash(req.body.password, saltValue))
      .then((hashPassword) =>
        _createUser(req.body.name, req.body.username, hashPassword)
      )
      .then((user) => {
        response.status = process.env.REST_API_CREATED;
        response.message = user;
      })
      .catch((err) => {
        response.status = process.env.REST_API_SYSTEM_ERROR;
        response.message = err;
      })
      .finally(() => _sendResponse(res, response));
  } else {
    response.status = process.env.REST_API_BAD_REQUEST;
    response.message = { message: "Must provide username for password" };
    _sendResponse(res, response);
  }
};
const _checkPassword = function (req, user) {
  return bcrypt.compare(req.body.password, user.password);
};

const _generateToken = function (passwordIsCorrenct, user, response) {
  if (passwordIsCorrenct) {
    const token = jwt.sign({ name: user.name }, process.env.JWT_PASSWORD, {
      expiresIn: 3600,
    });
    response.status = process.env.REST_API_OK;
    response.message = { success: true, token: token };
  } else {
    response.status = process.env.REST_API_UNAUTHORIZED;
    response.message = { message: "Unauthorized" };
  }
};

const login = function (req, res) {
  const response = {
    status: process.env.REST_API_OK,
    message: [],
  };
  let _user = {};
  if (req.body && req.body.username && req.body.password) {
    User.findOne({ username: req.body.username })
      .exec()
      .then((user) => {
        if (!user) {
          console.log(user);
          response.status = process.env.REST_API_UNAUTHORIZED;
          response.message = { message: "Unauthorized" };
          return;
        } else {
          _user = user;
          return _checkPassword(req, user);
        }
      })
      .then((passwordIsCorrenct) =>
        _generateToken(passwordIsCorrenct, _user, response)
      )
      .catch((err) => {
        response.status = process.env.REST_API_SYSTEM_ERROR;
        response.message = err;
      })
      .finally(() => _sendResponse(res, response));
  } else {
    response.status = process.env.REST_API_BAD_REQUEST;
    response.message = { message: "Must provide username for password" };
    _sendResponse(res, response);
  }
};

module.exports = {
  register,
  login,
};
