const bcrypt = require("bcrypt");
const crypto = require("crypto");
const _ = require("lodash");

const prismaClient = require("../../models/index");
const { BadRequestError } = require("../../core/ApiError");
const { SuccessResponse } = require("../../core/ApiResponse");
const { createTokens } = require("../../helpers/authUtils");

const userLogin = async (email, password) => {
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestError("Invalid credentials");
  if (!user.password) throw new BadRequestError("Password not set");

  const match = await bcrypt.compare(user.password, password);
  if (!match) throw new BadRequestError("Invalid credentials");

  const accessTokenKey = crypto.randomBytes(64).toString("hex");
  const refreshTokenKey = crypto.randomBytes(64).toString("hex");

  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

  new SuccessResponse("Login successfull", {
    user,
    tokens,
  }).send(res);
};
