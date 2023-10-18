const { Router } = require("express");
const router = new Router();

router.get("/login", (req, res) => {
  res.send("Login route");
});
module.exports = {
  router,
};
