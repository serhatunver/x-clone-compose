import { userRepository } from './user.repository.js';
import { followRepository } from '../follow/follow.repository.js';
import type { UpdateProfileInput } from '@repo/shared';
import { NotFoundError, ForbiddenError } from '#/lib/utils/error.handler.js';
import { ERROR_KEYS } from '@repo/shared';

export const userService = {
  async getProfile(username: string, currentUserId: string) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundError(ERROR_KEYS.USER.USER_NOT_FOUND, {
        username,
      });
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError(ERROR_KEYS.AUTH.ACCOUNT_SUSPENDED, {
        username,
      });
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
    if (!updatedUser) {
      throw new NotFoundError(ERROR_KEYS.USER.USER_NOT_FOUND, {
        userId,
      });
    }
    return updatedUser;
  },
};
