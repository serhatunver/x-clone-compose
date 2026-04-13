import { z } from 'zod';
import { usernameSchema } from '../common/user.js';

export const updateProfileBodySchema = z.object({
  avatar: z.string().optional(),
  cover_img: z.string().optional(),
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

export const getProfileParamsSchema = z.object({
  params: z.object({
    username: usernameSchema,
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileBodySchema>;
export type GetProfileParams = z.infer<typeof getProfileParamsSchema>['params'];
