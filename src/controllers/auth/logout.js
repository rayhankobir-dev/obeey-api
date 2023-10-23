const { SuccessResponse } = require("../../core/ApiResponse");
const asyncHandler = require("../../helpers/asyncHandler");
const prismaClient = require("../../models");

const logoutController = asyncHandler(async (req, res, next) => {
  await prismaClient.key.delete({ where: { id: req.key.id } });
  new SuccessResponse("Logout successfull").send(res);
});

module.exports = logoutController;
