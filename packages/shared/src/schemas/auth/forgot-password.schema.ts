import { z } from 'zod';
import { emailSchema } from '../common/primitives.js';

export const forgotPasswordBodySchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  body: forgotPasswordBodySchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordBodySchema>;
