import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    avatar: z.string().optional(), // Later we'll handle Cloudinary
    cover_img: z.string().optional(),
    bio: z.string().max(160, 'Bio can be at most 160 characters long.').optional(),
    link: z.url('Invalid URL format').max(100).optional().or(z.literal('')),
    location: z.string().max(30).optional().or(z.literal('')),
  }),
});

export const getProfileParamsSchema = z.object({
  params: z.object({
    username: z.string().min(1, 'Username is required'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type GetProfileParams = z.infer<typeof getProfileParamsSchema>['params'];
