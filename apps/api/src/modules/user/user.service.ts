import { userRepository } from './user.repository.js';
import { followRepository } from '../follow/follow.repository.js';
import type { UpdateProfileInput } from '@repo/validators';
import { NotFoundError } from '#/lib/utils/error.handler.js';

export const userService = {
  async getProfile(username: string, currentUserId: string) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      ...user,
      avatar:
        user.avatar ??
        `https://api.dicebear.com/9.x/lorelei/svg?backgroundColor=0D8ABC&seed=${user.username}`,
      isFollowing: await followRepository.isFollowing(currentUserId, user._id.toString()),
    };
  },

  async updateProfile(userId: string, updateData: Partial<UpdateProfileInput>) {
    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) throw new NotFoundError('User not found');
    return updatedUser;
  },
};
