const jwt = require("jsonwebtoken");
const util = require("util");

const authenticate = function (req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const jwtVerifyPromise = util.promisify(jwt.verify, {
      context: jwt,
    });
    jwtVerifyPromise(token, process.env.JWT_PASSWORD).then(() => next());
  } else {
    res
      .status(
        parseInt(
          process.env.REST_API_FORBIDDEN,
          process.env.INTERGER_CONVERSION_BASE
        )
      )
      .json({ message: "No token provided" });
  }
};
module.exports = {
  authenticate,
};
