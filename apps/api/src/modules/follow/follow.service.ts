import mongoose from 'mongoose';
import { followRepository } from './follow.repository.js';
import { userRepository } from '../user/user.repository.js';
import { BadRequestError, NotFoundError } from '#/lib/utils/error.handler.js';

export const followService = {
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestError('You cannot follow yourself');

    const targetUser = await userRepository.findById(followingId);
    if (!targetUser) throw new NotFoundError('User to follow not found');

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
};
