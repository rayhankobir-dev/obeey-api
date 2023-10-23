const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Prisma } = require("@prisma/client");
const prismaClient = require("../../models");
const { exclude } = require("../../helpers/lib");
const { createTokens } = require("../../helpers/authUtils");
const {
  ApiError,
  BadRequestError,
  InternalError,
} = require("../../core/ApiError");

const signupUser = async ({ firstName, lastName, email, password, role }) => {
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

    const createdUser = await prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
        roleId: fetchRole.id,
        key: {
          create: {
            primaryKey: accessTokenKey,
            secondaryKey: refreshTokenKey,
            status: true,
          },
        },
      },
      include: {
        role: {
          select: { id: true, role: true },
        },
      },
    });

    // excluding password and roleId
    const userData = await exclude(createdUser, ["password", "roleId"]);
    const tokens = await createTokens(
      userData,
      accessTokenKey,
      refreshTokenKey
    );

    return { user: userData, tokens };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.log(err);
    throw new InternalError("Internal server error");
  }
};

module.exports = signupUser;
