const getAccessToken = (authorization) => {
  if (!authorization) throw new Error("Invalid Authorization");
  if (!authorization.startsWith("Bearer "))
    throw new Error("Invalid Authorization");
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
    !isValidObjectId(payload.sub)
  )
    throw new Error("Invalid Access Token");
  return true;
};

const createTokens = async (user, accessTokenKey, refreshTokenKey) => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user.uid.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity
    )
  );

  if (!accessToken) throw new Error();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity
    )
  );

  if (!refreshToken) throw new Error();
  const Tokens = {
    accessToken,
    refreshToken,
  };

  return Tokens;
};

module.exports = {
  getAccessToken,
  validateTokenData,
};
