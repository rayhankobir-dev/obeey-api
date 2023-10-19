const { BadRequestError } = require("../../core/ApiError");
const { capitalizeFirstLetter } = require("../../helpers/lib");

const joiValidationMiddleware =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source], { abortEarly: false });

      if (!error) return next();

      const errors = [];
      error.details.map((i) =>
        errors.push({
          message: capitalizeFirstLetter(i.message.replace(/['"]+/g, "")),
        })
      );

      next(new BadRequestError("Invalid request parameters", errors));
    } catch (error) {
      next(error);
    }
  };

module.exports = joiValidationMiddleware;
