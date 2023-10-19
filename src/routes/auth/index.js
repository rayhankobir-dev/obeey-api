const { Router } = require("express");
const Joi = require("joi");
const { registerUser } = require("../../services/auth/register");
const asyncHandler = require("../../middleware/error");
const { BadRequestError } = require("../../core/ApiError");
const { SuccessResponse } = require("../../core/ApiResponse");

const router = new Router();

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});

const joiValidationMiddleware =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source], { abortEarly: false });

      if (!error) return next();

      const errors = [];
      const message = error.details.map((i) =>
        errors.push({ message: i.message.replace(/['"]+/g, "") })
      );
      console.error(errors);

      next(new BadRequestError(errors));
    } catch (error) {
      next(error);
    }
  };

router.get("/", joiValidationMiddleware(schema), async (req, res, next) => {
  new SuccessResponse("Login successfull", {
    uid: 123,
    name: "Rayhan",
  }).send(res);
});

module.exports = { router };
