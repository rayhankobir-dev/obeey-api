const express = require("express");
const router = new express.Router();
const { router: auth } = require("./auth");

router.use("/auth", auth);

module.exports = {
  router,
};
