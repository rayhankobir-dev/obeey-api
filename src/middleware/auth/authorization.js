const asyncHandler = require("../../helpers/asyncHandler");
const { AuthFailureError } = require("../../core/ApiError");
const prismaClient = require("../../models");

const authorization = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.roleId)
      throw new AuthFailureError("Permission denied");

    const roles = await prismaClient.role.findMany();
    if (!roles.some((role) => req.user.roleId == role.id))
      throw new AuthFailureError("Permission denieddd");
    next();
  });
};

module.exports = authorization;
