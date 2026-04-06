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
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  argon2: {
    memory: env.ARGON2_MEMORY,
    passes: env.ARGON2_PASSES,
    parallelism: env.ARGON2_PARALLELISM,
    tagLength: env.ARGON2_TAG_LENGTH,
    algorithm: env.ARGON2_ALGORITHM,
    version: env.ARGON2_VERSION,
  },
} as const;

export type Config = typeof config;
