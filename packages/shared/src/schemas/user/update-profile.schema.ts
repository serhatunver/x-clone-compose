import { z } from 'zod';
import { displayNameSchema } from '../common/primitives.js';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

export const updateProfileBodySchema = z.object({
  displayName: displayNameSchema.optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().max(160, V.TOO_LONG).optional(),
  link: z
    .url({ error: V.INVALID_URL })
    .max(100, V.TOO_LONG)
    .optional()
    .or(z.literal('')),
  location: z.string().max(30, V.TOO_LONG).optional().or(z.literal('')),
});

export const updateProfileSchema = z.object({
  body: updateProfileBodySchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileBodySchema>;
