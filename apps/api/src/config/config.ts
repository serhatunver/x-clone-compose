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
    redis: {
      uri: env.REDIS_URI,
    },
  },

  auth: {
    jwt: {
      access: {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      },
      refresh: {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    },
    verificationToken: {
      expiresIn: env.VERIFICATION_TOKEN_EXPIRES_IN,
      resendCooldown: env.VERIFICATION_TOKEN_RESEND_COOLDOWN,
    },
    resetToken: {
      expiresIn: env.RESET_TOKEN_EXPIRES_IN,
      resendCooldown: env.RESET_TOKEN_RESEND_COOLDOWN,
    },
    cookie: {
      baseOptions: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
      },
      getAccessOptions() {
        return {
          ...this.baseOptions,
          maxAge: env.JWT_ACCESS_EXPIRES_IN * 1000, // Convert to milliseconds
        };
      },
      getRefreshOptions() {
        return {
          ...this.baseOptions,
          maxAge: env.JWT_REFRESH_EXPIRES_IN * 1000, // Convert to milliseconds
          path: '/api/v1/auth/refresh', // Refresh token is only sent to the refresh endpoint
        };
      },
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
    global: {
      windowMs: env.RATE_LIMIT_GLOBAL_WINDOW_MS,
      limit: env.RATE_LIMIT_GLOBAL_LIMIT,
    },
    auth: {
      windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
      limit: env.RATE_LIMIT_AUTH_LIMIT,
    },
  },

  // services: {
  //   email: {
  //     resendApiKey: env.RESEND_API_KEY,
  //   },
  // },
} as const;

export type Config = typeof config;
