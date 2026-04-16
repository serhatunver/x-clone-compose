import type { Request, Response } from 'express';
import { followService } from './follow.service.js';
import type { FollowParams } from '@repo/shared';

/**
 * Toggle follow/unfollow status for a user
 */
export const toggleFollow = async (req: Request<FollowParams>, res: Response) => {
  const { id: followingId } = req.params; // ID of the user to follow
  const followerId = req.user._id.toString();

  const result = await followService.toggleFollow(followerId, followingId);

  return res.status(200).json(result);
};
