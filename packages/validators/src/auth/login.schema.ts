import { z } from 'zod';
import { usernameSchema, emailSchema } from '../common/index.js';

export const loginBodySchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, 'Username or email is required')
      .max(255),
    password: z.string().min(1, 'Password is required').max(64),
    remember: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const isEmail = data.identifier.includes('@');
      if (isEmail) return emailSchema.safeParse(data.identifier).success;
      return usernameSchema.safeParse(data.identifier).success;
    },
    {
      message: 'Please enter a valid username or email address.',
      path: ['identifier'],
    }
  );

export const loginSchema = z.object({ body: loginBodySchema });

export type LoginInput = z.infer<typeof loginBodySchema>;
