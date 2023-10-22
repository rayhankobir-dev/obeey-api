const Joi = require("joi");
const asyncHandler = require("../../helpers/asyncHandler");
const { ForbiddenError, BadRequestError } = require("../../core/ApiError");
const { schema, ValidationSource, Header } = require("../../helpers/validator");

const validation =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source], { abortEarly: false });

      if (!error) return next();

      let errors = [];
      error.details.map((i) =>
        errors.push({
          message: i.message.replace(/['"]+/g, ""),
        })
      );

      if (source === ValidationSource.HEADER) {
        throw new ForbiddenError("Permission denied", errors);
      }

      throw new BadRequestError("Bad request", errors);
    } catch (error) {
      next(error);
    }
  };

const apiKeyValidation = () => {
  return asyncHandler(async (req, res, next) => {
    const apiKey = req.headers[Header.API_KEY]?.toString();
    if (!apiKey) throw new ForbiddenError("x-api-key is required");
    if (process.env.API_KEY !== apiKey)
      throw new ForbiddenError("Invalid api key");
    next();
  });
};

module.exports = { validation, apiKeyValidation };
