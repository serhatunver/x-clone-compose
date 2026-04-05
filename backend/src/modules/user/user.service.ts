import { userRepository } from './user.repository.js';
import { followRepository } from '../follow/follow.repository.js';
import type { UpdateProfileInput } from './user.validation.js';
import { NotFoundError } from '#/lib/utils/error.handler.js';

export const userService = {
  async getProfile(username: string, currentUserId: string) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Return the profile with the isFollowing field
    const userObj = {
      ...user.toJSON(),
      isFollowing: await followRepository.isFollowing(currentUserId, user._id.toString()),
    };

    return userObj;
  },

  async updateProfile(userId: string, updateData: Partial<UpdateProfileInput>) {
    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) throw new NotFoundError('User not found');
    return updatedUser;
  },
};
