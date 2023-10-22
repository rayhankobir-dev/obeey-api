const asyncHandler = require("../../helpers/asyncHandler");
const signupUser = require("../../services/auth/signup");
const { SuccessResponse } = require("../../core/ApiResponse");

const signUpController = asyncHandler(async (req, res, next) => {
  const userData = await signupUser(req.body);
  new SuccessResponse("Signup successfull", userData, 201).send(res);
});

module.exports = signUpController;
