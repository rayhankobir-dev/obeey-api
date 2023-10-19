const asyncHandler = require("../../middleware/error");
const { SuccessResponse } = require("../../core/ApiResponse");

const loginController = async (req, res) => {
  new SuccessResponse("Login successfull", req.body).send(res);
};

module.exports = loginController;
