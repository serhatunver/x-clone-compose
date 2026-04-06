import { z } from 'zod';
import { logger } from '#/lib/utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z
    .string()
    .regex(/^mongodb(?:\+srv)?:\/\/.+/, 'MONGO_URI must be a valid MongoDB connection string'),
  CORS_ORIGIN: z.url(),
  // Authentication Configurations
  JWT_SECRET: z.string().min(12, 'JWT_SECRET must be at least 12 characters long'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_MAX_AGE: z.coerce.number().default(24 * 60 * 60 * 1000), // 1 day in milliseconds
  // Rate Limiting Configurations
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100), // Limit each IP to 100 requests per windowMs
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
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const formattedErrors = z.treeifyError(_env.error);
  logger.error(formattedErrors, 'Invalid environment variables');
  process.exit(1);
}

export const env = _env.data;
