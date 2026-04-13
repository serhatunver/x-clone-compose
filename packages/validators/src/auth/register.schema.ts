import { z } from 'zod';
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
} from '../common/index.js';

export const registerBodySchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  body: registerBodySchema,
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
