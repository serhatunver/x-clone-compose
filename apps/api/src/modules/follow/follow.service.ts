import { followRepository } from './follow.repository.js';
import { BadRequestError, NotFoundError } from '#/lib/utils/error.handler.js';
import User from '#/modules/user/user.model.js';

export const followService = {
  async toggleFollow(followerId: string, followingId: string) {
    // 1. Cannot follow yourself
    if (followerId === followingId) {
      throw new BadRequestError('You cannot follow yourself');
    }

    // 2. Check if target user exists
    const targetUser = await User.findById(followingId);
    if (!targetUser) {
      throw new NotFoundError('User to follow not found');
    }

    // 3. Check if already following
    const existingFollow = await followRepository.findFollow(followerId, followingId);

    if (existingFollow) {
      // Unfollow
      await followRepository.deleteFollow(followerId, followingId);
      return { isFollowing: false, message: 'Successfully unfollowed the user' };
    }

    // Follow
    await followRepository.createFollow(followerId, followingId);
    return { isFollowing: true, message: 'Successfully followed the user' };
  },
};
