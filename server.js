//importing installed dependencies
const express = require("express");
const routes = require("./api/routes");
const morgan = require("morgan");

const path = require("path");
const fs = require("fs");

const statsUtils = require("./api/utils/statsd-utils");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "combined.log"),
  { flags: "a" }
);

const app = express();

app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(statsUtils);

routes(app);

module.exports = app;
