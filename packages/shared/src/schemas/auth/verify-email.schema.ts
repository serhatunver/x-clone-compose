import { z } from 'zod';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

export const verifyEmailParamsSchema = z.object({
  token: z.string().min(1, V.REQUIRED).max(255, V.TOO_LONG),
});

export const verifyEmailSchema = z.object({
  params: verifyEmailParamsSchema,
});

export type VerifyEmailParams = z.infer<typeof verifyEmailParamsSchema>;
