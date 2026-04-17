import mongoose from 'mongoose';
import { followRepository } from './follow.repository.js';
import { userRepository } from '../user/user.repository.js';
import { BadRequestError, NotFoundError } from '#/lib/utils/error.handler.js';
import { ERROR_KEYS, type FollowParams, type FollowQuery } from '@repo/shared';

export const followService = {
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError(ERROR_KEYS.FOLLOW.CANNOT_FOLLOW_SELF);
    }

    const targetUser = await userRepository.findById(followingId);
    if (!targetUser) {
      throw new NotFoundError(ERROR_KEYS.FOLLOW.USER_NOT_FOUND, {
        userId: followingId,
      });
    }

    const result = await mongoose.connection.transaction(async () => {
      const existingFollow = await followRepository.findFollow(followerId, followingId);

      if (existingFollow) {
        await followRepository.deleteFollow(followerId, followingId);

        await userRepository.adjustCounts(followingId, { followersCount: 'decrement' });
        await userRepository.adjustCounts(followerId, { followingCount: 'decrement' });

        return { isFollowing: false, message: 'Unfollowed' };
      } else {
        await followRepository.createFollow(followerId, followingId);

        await userRepository.adjustCounts(followingId, { followersCount: 'increment' });
        await userRepository.adjustCounts(followerId, { followingCount: 'increment' });

        return { isFollowing: true, message: 'Followed' };
      }
    });

    return result;
  },

  async getFollowers(userId: FollowParams['userId'], query: FollowQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const followers = await followRepository.getFollowers(userId, limit, skip);
    return followers.map((f) => f.follower);
  },

  async getFollowing(userId: FollowParams['userId'], query: FollowQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const following = await followRepository.getFollowing(userId, limit, skip);
    return following.map((f) => f.following);
  },
};
