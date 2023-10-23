const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prismaClient = require("../../models");
const asyncHandler = require("../../helpers/asyncHandler");
const { createTokens } = require("../../helpers/authUtils");
const { SuccessResponse } = require("../../core/ApiResponse");
const { BadRequestError, AuthFailureError } = require("../../core/ApiError");
const { exclude } = require("../../helpers/lib");

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findUnique({
    where: { email },
    include: {
      role: {
        select: { id: true, role: true },
      },
      key: true,
    },
  });

  if (!user) throw new BadRequestError("Invalid credentials");
  if (!user.password) throw new BadRequestError("Password not set");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthFailureError("Incorrect email or password");

  const accessTokenKey = crypto.randomBytes(64).toString("hex");
  const refreshTokenKey = crypto.randomBytes(64).toString("hex");

  if (user.key) {
    await prismaClient.key.delete({ where: { id: user.key.id } });
  }

  await prismaClient.key.create({
    data: {
      userId: user.id,
      primaryKey: accessTokenKey,
      secondaryKey: refreshTokenKey,
    },
  });

  const userData = await exclude(user, ["password", "roleId", "key"]);
  const tokens = await createTokens(userData, accessTokenKey, refreshTokenKey);

  new SuccessResponse("Login successfull", {
    user: userData,
    tokens,
  }).send(res);
});

module.exports = loginController;
