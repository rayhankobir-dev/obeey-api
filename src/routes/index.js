const express = require("express");
const router = new express.Router();
const { router: auth } = require("./auth");
const { validation, apiKeyValidation } = require("../middleware/validation");
const { schema, ValidationSource } = require("../helpers/validator");
const asyncHandler = require("../helpers/asyncHandler");
const prismaClient = require("../models");
const {
  BadRequestError,
  NotFoundError,
  NoEntryError,
} = require("../core/ApiError");
const { SuccessResponse } = require("../core/ApiResponse");
const { createRole } = require("../services/role");

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
