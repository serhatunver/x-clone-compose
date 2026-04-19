import { z } from 'zod';

export const verifyEmailParamsSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const verifyEmailSchema = z.object({
  params: verifyEmailParamsSchema,
});

export type VerifyEmailParams = z.infer<typeof verifyEmailParamsSchema>;
