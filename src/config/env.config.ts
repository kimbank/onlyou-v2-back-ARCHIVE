import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  SWAGGER_USER: process.env.SWAGGER_USER,
  SWAGGER_PWD: process.env.SWAGGER_PWD,
  DOMAIN: process.env.DOMAIN,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
}));

export const authConfig = registerAs('auth', () => ({
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  ACCESS_JWT_EXPIRATION: parseInt(process.env.ACCESS_JWT_EXPIRATION, 10),
  REFRESH_JWT_EXPIRATION: parseInt(process.env.REFRESH_JWT_EXPIRATION, 10),
  ENCRYPT_KEY: process.env.ENCRYPT_KEY,
  ENCRYPT_IV: process.env.ENCRYPT_IV,
  CODE_EXPIRATION: parseInt(process.env.CODE_EXPIRATION, 10),
}));

export const slackConfig = registerAs('slack', () => ({
  SLACK_TOKEN_LOGIN: process.env.SLACK_TOKEN_LOGIN,
  SLACK_CHANNEL_LOGIN: process.env.SLACK_CHANNEL_LOGIN,
  SLACK_CHANNEL_DORMANT: process.env.SLACK_CHANNEL_DORMANT,
  SLACK_CHANNEL_MATCHING_AGREEMENT:
    process.env.SLACK_CHANNEL_MATCHING_AGREEMENT,
}));

export const ncpConfig = registerAs('ncp', () => ({
  NCP_SENS_URL_LOGIN: process.env.NCP_SENS_URL_LOGIN,
  NCP_SENS_SERVICE_ID_LOGIN: process.env.NCP_SENS_SERVICE_ID_LOGIN,
  NCP_API_ACCESS_KEY: process.env.NCP_API_ACCESS_KEY,
  NCP_API_SECRET_KEY: process.env.NCP_API_SECRET_KEY,
  NCP_SENS_MOBILE_NUMBER: process.env.NCP_SENS_MOBILE_NUMBER,
}));

export const adminAccessConfig = registerAs('adminAccess', () => ({
  ADMIN_ACCESS_KEY: process.env.ADMIN_ACCESS_KEY,
}));
