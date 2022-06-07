require("dotenv").config();
require("./api/data/db");

const express = require("express");
const app = express();

const router = require("./api/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Header",
    "Origin,X-Required-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
  next();
});

app.use("/api", router);

const server = app.listen(process.env.PORT, function () {
  console.log("Server is running on port", server.address().port);
});
