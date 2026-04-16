import { userRepository } from './user.repository.js';
import { followRepository } from '../follow/follow.repository.js';
import type { UpdateProfileInput } from '@repo/validators';
import { NotFoundError, ForbiddenError } from '#/lib/utils/error.handler.js';

export const userService = {
  async getProfile(username: string, currentUserId: string) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError('This account is suspended');
    }

    const isMe = user._id.toString() === currentUserId;

    return {
      ...user,
      avatar:
        user.avatar ??
        `https://api.dicebear.com/9.x/lorelei/svg?backgroundColor=0D8ABC&seed=${user.username}`,
      isMe,
      isFollowing: isMe
        ? false
        : await followRepository.isFollowing(currentUserId, user._id.toString()),
    };
  },

  async updateProfile(userId: string, updateData: Partial<UpdateProfileInput>) {
    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) throw new NotFoundError('User not found');
    return updatedUser;
  },
};
