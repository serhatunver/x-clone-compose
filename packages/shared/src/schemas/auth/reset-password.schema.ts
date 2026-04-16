import { z } from 'zod';
import { passwordSchema } from '../common/primitives.js';

export const resetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
  body: resetPasswordBodySchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordBodySchema>;
