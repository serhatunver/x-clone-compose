import { z } from 'zod';
import { usernameSchema, emailSchema } from '../common/primitives.js';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

export const loginBodySchema = z
  .object({
    identifier: z.string().trim().min(1, V.REQUIRED).max(255, V.TOO_LONG),
    password: z.string().min(1, V.REQUIRED).max(64, V.TOO_LONG),
    remember: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const isEmail = data.identifier.includes('@');
      if (isEmail) return emailSchema.safeParse(data.identifier).success;
      return usernameSchema.safeParse(data.identifier).success;
    },
    {
      error: V.INVALID_FORMAT,
      path: ['identifier'],
    }
  );

export const loginSchema = z.object({ body: loginBodySchema });
export type LoginInput = z.infer<typeof loginBodySchema>;
