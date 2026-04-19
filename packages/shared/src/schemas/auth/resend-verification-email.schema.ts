import { z } from 'zod';
import { emailSchema } from '../common/primitives.js';

export const resendVerificationEmailBodySchema = z.object({
  email: emailSchema,
});

export const resendVerificationEmailSchema = z.object({
  body: resendVerificationEmailBodySchema,
});

export type ResendVerificationEmailInput = z.infer<
  typeof resendVerificationEmailBodySchema
>;
