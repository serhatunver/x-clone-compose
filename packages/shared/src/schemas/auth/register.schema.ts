import { z } from 'zod';
import {
  displayNameSchema,
  usernameSchema,
  emailSchema,
  passwordSchema,
} from '../common/primitives.js';

export const registerBodySchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  body: registerBodySchema,
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
