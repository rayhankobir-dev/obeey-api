const { ApiError } = require("../../core/ApiError");

// handler errors for async controller
const asyncHandler = (controller) => async (req, res, next) => {
  try {
    await controller();
  } catch (err) {
    if (err instanceof ApiError) {
      return ApiError.handle(err, res);
    }
    return next(err);
  }
};

module.exports = asyncHandler;
