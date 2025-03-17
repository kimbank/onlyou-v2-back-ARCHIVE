import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PWD: Joi.string().required(),
  DOMAIN: Joi.string().required(),
  DISCORD_WEBHOOK_URL: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
  PORT: Joi.string().required(),

  ACCESS_JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_SECRET: Joi.string().required(),
  ACCESS_JWT_EXPIRATION: Joi.string().required(),
  REFRESH_JWT_EXPIRATION: Joi.string().required(),
  ENCRYPT_KEY: Joi.string().required(),
  ENCRYPT_IV: Joi.string().required(),
  CODE_EXPIRATION: Joi.string().required(),

  NCP_SENS_URL_LOGIN: Joi.string().required(),
  NCP_SENS_SERVICE_ID_LOGIN: Joi.string().required(),
  NCP_API_ACCESS_KEY: Joi.string().required(),
  NCP_API_SECRET_KEY: Joi.string().required(),
  NCP_SENS_MOBILE_NUMBER: Joi.string().required(),

  SLACK_TOKEN_LOGIN: Joi.string().required(),
  SLACK_CHANNEL_LOGIN: Joi.string().required(),
  SLACK_CHANNEL_DORMANT: Joi.string().required(),
  SLACK_CHANNEL_MATCHING_AGREEMENT: Joi.string().required(),

  ADMIN_ACCESS_KEY: Joi.string().required(),
});
