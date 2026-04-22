import mongoose from 'mongoose';
import { followRepository } from './follow.repository.js';
import { userRepository } from '../user/user.repository.js';
import { BadRequestError } from '#/lib/errors/index.js';
import { RESPONSE_KEYS, type FollowParams, type FollowQuery } from '@repo/shared';

export const followService = {
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.FOLLOW.CANNOT_FOLLOW_SELF);
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
