const asyncHandler = require("../../helpers/asyncHandler");
const { AuthFailureError } = require("../../core/ApiError");

const authorization = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role)
      throw new AuthFailureError("Permission denied");
    if (!allowedRoles.some((role) => req.user.role.includes(role)))
      throw new AuthFailureError("Permission denied");

    next();
  });
};

module.exports = authorization;
