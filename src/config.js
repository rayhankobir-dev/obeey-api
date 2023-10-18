const dotenv = require("dotenv");
dotenv.config();

const environment = process.env.MODE_ENV;
const port = process.env.PORT || 3000;
const timezone = process.env.TIME_ZONE;

const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "",
  port: process.env.DB_PORT || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_USER_PWD || "",
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || "5"),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || "10"),
};

const corsUrl = process.env.CORS_URL;

const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || "0"),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || "0"),
};

const logDirectory = process.env.LOG_DIR;

const redis = {
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "0"),
  password: process.env.REDIS_PASSWORD || "",
};

const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || "600000"
  ),
};

module.exports = {
  environment,
  port,
  timezone,
  db,
  corsUrl,
  tokenInfo,
  logDirectory,
  redis,
  caching,
};
