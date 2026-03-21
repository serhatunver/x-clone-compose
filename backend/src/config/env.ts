import { z } from 'zod';
import type { SignOptions } from 'jsonwebtoken';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().regex(/^mongodb(?:\+srv)?:\/\/.+/, 'MONGO_URI must be a valid MongoDB connection string'),
  JWT_SECRET: z.string().min(12, 'JWT_SECRET must be at least 12 characters long'),
  JWT_EXPIRES_IN: z
    .union([
      z
        .string()
        .regex(
          /^(?:\d+(?:\.\d+)?)\s?(ms|s|m|h|d|w|y)?$/i,
          'JWT_EXPIRES_IN must be a valid duration string (e.g., "1h", "30m")',
        ),
      z.number().int().nonnegative(),
    ])
    .default('1d') as z.ZodType<SignOptions['expiresIn']>,
  CORS_ORIGIN: z.url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
