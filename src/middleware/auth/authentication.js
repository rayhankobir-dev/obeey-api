const { AuthFailureError, TokenExpiredError } = require("../../core/ApiError");
const { JWT } = require("../../core/JWT");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  getAccessToken,
  validateTokenData,
} = require("../../helpers/authUtils");
const prismaClient = require("../../models");

const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization);

    try {
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await prismaClient.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new AuthFailureError("User not registered");
      req.user = user;

      const key = await prismaClient.key.findUnique({
        where: { userId: user.id, primaryKey: payload.prm },
      });

      if (!key) throw new AuthFailureError("Invalid access token");
      req.key = key;

      return next();
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new AccessTokenError(err.message);
      throw err;
    }
  });
};

module.exports = authentication;
