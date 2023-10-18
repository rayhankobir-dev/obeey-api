const express = require("express");
const router = new express.Router();
const { router: auth } = require("./auth");
const { router: user } = require("./user");
const { router: podcast } = require("./podcast");

router.use("/auth", auth);
router.use("/user", user);
router.use("/podcast", podcast);

module.exports = {
  router,
};
