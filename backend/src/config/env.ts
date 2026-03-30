import { z } from 'zod';
import { logger } from '#/lib/utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z
    .string()
    .regex(/^mongodb(?:\+srv)?:\/\/.+/, 'MONGO_URI must be a valid MongoDB connection string'),
  JWT_SECRET: z.string().min(12, 'JWT_SECRET must be at least 12 characters long'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_MAX_AGE: z.coerce.number().default(24 * 60 * 60 * 1000), // 1 day in milliseconds
  CORS_ORIGIN: z.url(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100), // Limit each IP to 100 requests per windowMs
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const formattedErrors = z.treeifyError(_env.error);
  logger.error(formattedErrors, 'Invalid environment variables');
  process.exit(1);
}

export const env = _env.data;
