const Joi = require("joi");
const { JoiAuthBearer } = require("../../helpers/validator");

const schema = {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),

  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),

  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),

  signup: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().optional().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string()
      .default("USER")
      .valid("USER", "ADMIN", "GUEST", "UPLOADER"),
  }),
};

module.exports = schema;
