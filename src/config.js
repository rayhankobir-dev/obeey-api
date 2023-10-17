const dotenv = require("dotenv");
dotenv.config();

export const port = process.env.PORT || 3000;
export const timezone = process.env.TIME_ZONE;

export const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_USER_PWD || "",
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || "5"),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || "10"),
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || "0"),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || "0"),
};

export const logDirectory = process.env.LOG_DIR;

export const redis = {
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "0"),
  password: process.env.REDIS_PASSWORD || "",
};

export const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || "600000"
  ),
};
