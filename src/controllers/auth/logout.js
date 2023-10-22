const { SuccessResponse } = require("../../core/ApiResponse");
const asyncHandler = require("../../helpers/asyncHandler");
const prismaClient = require("../../models");

const logoutController = asyncHandler(async (req, res, next) => {
  console.log(req.keys);
  await prismaClient.keys.delete({ where: { id: req.keys.id } });
  new SuccessResponse("Logout successfull").send(res);
});

module.exports = logoutController;
