const crypto = require("crypto");
const prismaClient = require("../../models");
const { JWT } = require("../../core/JWT");
const { AuthFailureError } = require("../../core/ApiError");
const {
  TokenRefreshResponse,
  InternalErrorResponse,
} = require("../../core/ApiResponse");
const {
  getAccessToken,
  validateTokenData,
} = require("../../helpers/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
// token controller
const tokenController = asyncHandler(async (req, res) => {
  try {
    req.accessToken = getAccessToken(req.headers.authorization);
    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await prismaClient.user.findFirst({
      where: { id: accessTokenPayload.sub },
    });

    if (!user) throw new AuthFailureError("User not registered");
    req.user = user;

    const refreshTokenPayload = await JWT.decode(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError("Invalid access token");

    const key = await prismaClient.key.findUnique({
      where: {
        user: req.user,
        primaryKey: accessTokenPayload.prm,
        secondaryKey: refreshTokenPayload.prm,
      },
    });

    if (!key) throw new AuthFailureError("Invalid access token");
    await prismaClient.key.delete({ where: { id: key.id } });

    const accessToken = crypto.randomBytes(64).toString("hex");
    const refreshToken = crypto.randomBytes(64).toString("hex");

    await prismaClient.key.create({
      data: {
        user: req.user,
        primaryKey: accessToken,
        secondaryKey: refreshToken,
      },
    });

    new TokenRefreshResponse("Token issued", {
      user: req.user,
      accessToken,
      refreshToken,
    }).send(res);
  } catch (err) {
    console.log(err);
    new InternalErrorResponse("Token problem").send(res);
  }
});

module.exports = tokenController;
