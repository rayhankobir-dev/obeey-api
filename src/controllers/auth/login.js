const bcrypt = require("bcrypt");
const crypto = require("crypto");

const asyncHandler = require("../../helpers/asyncHandler");
const { SuccessResponse } = require("../../core/ApiResponse");
const prismaClient = require("../../models");
const { BadRequestError, AuthFailureError } = require("../../core/ApiError");
const { createTokens } = require("../../helpers/authUtils");
// const { registerUser } = require("../../services/auth/register");

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) throw new BadRequestError("Invalid credentials");
  if (!user.password) throw new BadRequestError("Password not set");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthFailureError("Incorrect email or password");

  const accessTokenKey = crypto.randomBytes(64).toString("hex");
  const refreshTokenKey = crypto.randomBytes(64).toString("hex");

  await prismaClient.keys.delete({ where: { userId: user.id } });
  await prismaClient.keys.create({
    data: {
      userId: user.id,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
    },
  });

  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

  new SuccessResponse("Login successfull", {
    user,
    tokens,
  }).send(res);
});

module.exports = loginController;
