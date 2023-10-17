const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");

const app = express();
app.use("/", routes);
module.exports = app;
