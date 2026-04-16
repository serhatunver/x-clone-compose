import { z } from 'zod';

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const followParamsSchema = z.object({
  id: z.string().regex(OBJECT_ID_REGEX, 'Invalid User ID format'),
});

export const followSchema = z.object({
  params: followParamsSchema,
});

export type FollowParams = z.infer<typeof followParamsSchema>;
