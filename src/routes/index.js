const express = require("express");
const router = new express.Router();
const { router: auth } = require("./auth");
const { validation, apiKeyValidation } = require("../middleware/validation");
const { schema, ValidationSource } = require("../helpers/validator");

//validate api-key
router.use(
  validation(schema.apiKey, ValidationSource.HEADER),
  apiKeyValidation()
);

// regular route
router.use("/auth", auth);

module.exports = {
  router,
};
