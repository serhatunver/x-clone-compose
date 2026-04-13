import User from './user.model.js';
import type { UpdateProfileInput } from '@repo/validators';

export const userRepository = {
  async findByUsername(username: string) {
    return User.findOne({ username })
      .populate('followersCount') // Virtual fields
      .populate('followingCount')
      .populate('totalPosts');
  },

  async findById(id: string) {
    return User.findById(id).populate('followersCount').populate('followingCount');
  },

  async updateById(id: string, data: Partial<UpdateProfileInput>) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  },
};
