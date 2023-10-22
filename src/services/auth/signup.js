const prismaClient = require("../../models");
const { makeHashed } = require("../../helpers/lib");
const {
  ApiError,
  BadRequestError,
  InternalError,
} = require("../../core/ApiError");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { createTokens } = require("../../helpers/authUtils");
const { Prisma } = require("@prisma/client");

const signupUser = async ({
  firstName,
  lastName,
  email,
  password,
  role = "USER",
}) => {
  try {
    const user = await prismaClient.user.findFirst({ where: { email } });
    if (user) throw new BadRequestError("User already registered!");

    const fetchRole = await prismaClient.role.findFirst({
      where: { role: role },
    });
    if (!fetchRole) throw new BadRequestError("Role is not defined");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    const hashPassword = await bcrypt.hash(password, 10);

    const userData = await prismaClient.$transaction(
      async (prismaClient) => {
        const createdUser = await prismaClient.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashPassword,
            roleId: fetchRole.id,
          },
        });

        const keys = await prismaClient.keys.create({
          data: {
            userId: createdUser.id,
            primaryKey: accessTokenKey,
            secondaryKey: refreshTokenKey,
          },
        });

        const tokens = await createTokens(
          createdUser,
          keys.primaryKey,
          keys.secondaryKey
        );

        return { user: createdUser, tokens };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      }
    );

    return userData;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log(err);
    throw new InternalError("Internal server error");
  }
};

module.exports = signupUser;
