import { z } from 'zod';
import { usernameSchema } from '../common/primitives.js';

export const getProfileParamsSchema = z.object({
  username: usernameSchema,
});

export const getProfileSchema = z.object({
  params: getProfileParamsSchema,
});

export type GetProfileParams = z.infer<typeof getProfileParamsSchema>;
