import { z } from 'zod';
import { emailSchema, passwordSchema } from '../common/index.js';

export const forgotPasswordBodySchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  body: forgotPasswordBodySchema,
});

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

export type ForgotPasswordInput = z.infer<typeof forgotPasswordBodySchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordBodySchema>;
