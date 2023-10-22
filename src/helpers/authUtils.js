const { tokenInfo } = require("../config");
const { AuthFailureError, InternalError } = require("../core/ApiError");
const { JWT, JwtPayload } = require("../core/JWT");

const getAccessToken = (authorization) => {
  if (!authorization) throw new AuthFailureError("Invalid Authorization");
  if (!authorization.startsWith("Bearer "))
    throw new AuthFailureError("Invalid Authorization");
  return authorization.split(" ")[1];
};

const validateTokenData = (payload) => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !payload.sub
  )
    throw new AuthFailureError("Invalid access token");
  return true;
};

const createTokens = async (user, accessTokenKey, refreshTokenKey) => {
  const accessToken = await JWT.encode(
    Object.assign(
      {},
      new JwtPayload(
        tokenInfo.issuer,
        tokenInfo.audience,
        user.id.toString(),
        accessTokenKey,
        tokenInfo.accessTokenValidity
      )
    )
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    Object.assign(
      {},
      new JwtPayload(
        tokenInfo.issuer,
        tokenInfo.audience,
        user.id.toString(),
        refreshTokenKey,
        tokenInfo.refreshTokenValidity
      )
    )
  );

  if (!refreshToken) throw new InternalError();

  const tokens = {
    accessToken,
    refreshToken,
  };
  return tokens;
};

module.exports = { createTokens, validateTokenData, getAccessToken };
