import type { Response } from 'express';
import type { ValidatedRequest } from '#/types/api.types.js';
import { followToggleSchema, followListSchema } from '@repo/shared';
import { followService } from './follow.service.js';

/**
 * Toggle follow/unfollow status for a user
 */
export const toggleFollow = async (
  req: ValidatedRequest<typeof followToggleSchema>,
  res: Response,
) => {
  const { userId } = req.validated.params;
  const followerId = req.user._id;

  const result = await followService.toggleFollow(followerId, userId);

  return res.status(200).json(result);
};

export const getFollowers = async (
  req: ValidatedRequest<typeof followListSchema>,
  res: Response,
): Promise<Response> => {
  const { userId } = req.validated.params;
  const { page, limit } = req.validated.query;
  const followers = await followService.getFollowers(userId, { page, limit });
  return res.status(200).json(followers);
};

export const getFollowing = async (
  req: ValidatedRequest<typeof followListSchema>,
  res: Response,
) => {
  const { userId } = req.validated.params;
  const { page, limit } = req.validated.query;
  const following = await followService.getFollowing(userId, { page, limit });
  return res.status(200).json(following);
};
