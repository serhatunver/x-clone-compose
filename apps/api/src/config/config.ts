import { env } from './env.js';

export const config = {
  app: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    clientUrl: env.CLIENT_URL,
  },

  database: {
    mongodb: {
      uri: env.MONGO_URI,
    },
    // redis: {
    //   uri: env.REDIS_URI, // Future Redis config for rate limiting and queues
    // },
  },

  security: {
    auth: {
      jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
      },
      cookie: {
        maxAge: env.COOKIE_MAX_AGE,
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      },
      argon2: {
        memory: env.ARGON2_MEMORY,
        passes: env.ARGON2_PASSES,
        parallelism: env.ARGON2_PARALLELISM,
        tagLength: env.ARGON2_TAG_LENGTH,
        algorithm: env.ARGON2_ALGORITHM,
        version: env.ARGON2_VERSION,
      },
    },
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
  },

  // services: {
  //   email: {
  //     resendApiKey: env.RESEND_API_KEY,
  //   },
  // },
} as const;

export type Config = typeof config;
