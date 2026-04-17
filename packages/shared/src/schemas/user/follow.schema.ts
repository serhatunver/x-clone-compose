import { z } from 'zod';

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const userIdParam = z.object({
  userId: z.string().regex(OBJECT_ID_REGEX, 'Invalid User ID format'),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const followToggleSchema = z.object({
  params: userIdParam,
});

export const followListSchema = z.object({
  params: userIdParam,
  query: paginationQuery,
});

export type FollowParams = z.infer<typeof userIdParam>;
export type FollowQuery = z.infer<typeof paginationQuery>;
