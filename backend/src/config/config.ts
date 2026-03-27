import { env } from './env.js';

export const config = {
  app: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
  },
  db: {
    mongoUri: env.MONGO_URI,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    cookieMaxAge: env.COOKIE_MAX_AGE,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
} as const;

export type Config = typeof config;
