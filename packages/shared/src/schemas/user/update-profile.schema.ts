import { z } from 'zod';
import { displayNameSchema } from '../common/primitives.js';

export const updateProfileBodySchema = z.object({
  displayName: displayNameSchema.optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z
    .string()
    .max(160, 'Bio can be at most 160 characters long.')
    .optional(),
  link: z.url('Invalid URL format').max(100).optional().or(z.literal('')),
  location: z.string().max(30).optional().or(z.literal('')),
});

export const updateProfileSchema = z.object({
  body: updateProfileBodySchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileBodySchema>;
