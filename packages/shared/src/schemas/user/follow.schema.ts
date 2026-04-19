import { z } from 'zod';
import { RESPONSE_KEYS } from '@repo/shared';

const V = RESPONSE_KEYS.ERROR.VALIDATION;

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const userIdParam = z.object({
  userId: z.string().regex(OBJECT_ID_REGEX, V.INVALID_FORMAT),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100, V.TOO_LONG).default(20),
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
