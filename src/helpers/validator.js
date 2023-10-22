const Joi = require("joi");

const Header = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const ValidationSource = {
  BODY: "body",
  HEADER: "headers",
  QUERY: "query",
  PARAM: "params",
};

const JoiUrlEndpoint = () =>
  Joi.string().custom((value, helpers) => {
    if (value.includes("://")) return helpers.error("any.invalid");
    return value;
  }, "Url Endpoint Validation");

const JoiAuthBearer = () =>
  Joi.string().custom((value, helpers) => {
    if (!value.startsWith("Bearer ")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Authorization Header Validation");

const schema = {
  apiKey: Joi.object()
    .keys({
      [Header.API_KEY]: Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};

module.exports = {
  Header,
  ValidationSource,
  JoiUrlEndpoint,
  JoiAuthBearer,
  schema,
};
