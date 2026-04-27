import { z } from 'zod';
import { logger } from '#/lib/utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),

  // Client Configuration
  CLIENT_URL: z.url(),

  // Database Configuration
  MONGO_URI: z
    .string()
    .regex(/^mongodb(?:\+srv)?:\/\/.+/, 'MONGO_URI must be a valid MongoDB connection string'),
  REDIS_URI: z.string(),

  //Services Configuration
  // RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required for sending emails'),
  EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required for sending emails'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1, 'EMAIL_USER is required for sending emails'),
  EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required for sending emails'),
  EMAIL_FROM: z.email().default('noreply@xclone.com'),

  // JWT Configurations
  JWT_ACCESS_SECRET: z.string().min(12, 'JWT_ACCESS_SECRET must be at least 12 characters long'),
  JWT_ACCESS_EXPIRES_IN: z.coerce.number().default(15 * 60), // Access tokens expire in 15 minutes (in seconds)
  JWT_REFRESH_SECRET: z
    .string()
    .min(12, 'JWT_SECRET JWT_REFRESH_SECRET be at least 12 characters long'),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(7 * 24 * 60 * 60), // Refresh tokens expire in 7 days (in seconds)

  // Verification and Reset Token Configurations
  VERIFICATION_TOKEN_EXPIRES_IN: z.coerce.number().default(24 * 60 * 60 * 1000), // 24 hours
  VERIFICATION_TOKEN_RESEND_COOLDOWN: z.coerce.number().default(5 * 60 * 1000), // 5 minutes
  RESET_TOKEN_EXPIRES_IN: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RESET_TOKEN_RESEND_COOLDOWN: z.coerce.number().default(5 * 60 * 1000), // 5 minutes

  // Rate Limiting Configurations
  RATE_LIMIT_GLOBAL_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_GLOBAL_LIMIT: z.coerce.number().default(100), // Limit each IP to 100 requests per windowMs
  RATE_LIMIT_AUTH_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_AUTH_LIMIT: z.coerce.number().default(5), // Limit each IP to 5 auth requests per windowMs

  // Argon2 Configurations
  ARGON2_MEMORY: z.coerce
    .number()
    .min(8 * 1024, 'ARGON2_MEMORY must be at least 8 MB')
    .max(128 * 1024, 'ARGON2_MEMORY must be at most 128 MB')
    .default(16 * 1024), // Memory cost in KB (16 MB)
  ARGON2_PASSES: z.coerce
    .number()
    .min(1, 'ARGON2_PASSES must be at least 1')
    .max(10, 'ARGON2_PASSES must be at most 10')
    .default(2), // Number of iterations
  ARGON2_PARALLELISM: z.coerce
    .number()
    .min(1, 'ARGON2_PARALLELISM must be at least 1')
    .max(4, 'ARGON2_PARALLELISM must be at most 4')
    .default(1), // Number of parallel threads
  ARGON2_TAG_LENGTH: z.coerce
    .number()
    .min(16, 'ARGON2_TAG_LENGTH must be at least 16 bytes')
    .max(64, 'ARGON2_TAG_LENGTH must be at most 64 bytes')
    .default(32), // Length of the derived key in bytes
  ARGON2_ALGORITHM: z.enum(['argon2id']).default('argon2id'), // Supported Argon2 algorithms
  ARGON2_VERSION: z.coerce
    .string()
    .pipe(z.enum(['19']))
    .default('19'), // Argon2 version (19 is the current stable version)

  // Queue Configurations
  EMAIL_QUEUE_CONCURRENCY: z.coerce.number().default(5), // Number of concurrent workers for processing email jobs
  EMAIL_QUEUE_DRAIN_DELAY: z.coerce.number().default(60), // Delay in seconds before checking for new jobs when the queue is empty (60 seconds)
  EMAIL_QUEUE_STALLED_INTERVAL: z.coerce.number().default(300000), // Time in milliseconds to check for stalled jobs (5 minutes)
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const formattedErrors = z.treeifyError(_env.error);
  logger.error(formattedErrors, 'Invalid environment variables');
  process.exit(1);
}

export const env = _env.data;
