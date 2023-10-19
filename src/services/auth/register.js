const { prismaClient } = require("../../models/index");
const { makeHashed } = require("../../helpers/lib");
const { BadRequestError } = require("../../core/ApiError");

const registerUser = () => {
  throw new BadRequestError("Bad ");
};

module.exports = {
  registerUser,
};
