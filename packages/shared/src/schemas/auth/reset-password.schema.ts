import { z } from 'zod';
import { passwordSchema } from '../common/primitives.js';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

export const resetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, V.REQUIRED).max(64, V.TOO_LONG),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: V.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, V.REQUIRED).max(255, V.TOO_LONG),
  }),
  body: resetPasswordBodySchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordBodySchema>;
