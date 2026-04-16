import User, { type IUser } from './user.model.js';
import type { UpdateProfileInput } from '@repo/shared';
import type { UpdateQuery } from 'mongoose';
import { BadRequestError } from '#/lib/utils/error.handler.js';
import { ERROR_KEYS } from '@repo/shared';

type UserCounterFields = keyof Pick<IUser, 'followersCount' | 'followingCount' | 'totalPosts'>;
type CounterAction = 'increment' | 'decrement';

export const userRepository = {
  async findByUsername(username: string) {
    return User.findOne({ username, status: { $ne: 'deactivated' } }).lean();
  },

  async findById(id: string) {
    return User.findById(id);
  },

  async updateById(id: string, data: Partial<UpdateProfileInput>) {
    return User.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: 'after', runValidators: true },
    );
  },

  async adjustCounts(userId: string, updates: Partial<Record<UserCounterFields, CounterAction>>) {
    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestError(ERROR_KEYS.USER.UPDATE_FAILED, {
        reason: 'No updates provided for user counts',
      });
    }

    const updateQuery: UpdateQuery<IUser>['$inc'] = {};
    const filter: Record<string, unknown> = { _id: userId };

    (Object.entries(updates) as [UserCounterFields, CounterAction][]).forEach(([field, action]) => {
      const amount = action === 'increment' ? 1 : -1;
      updateQuery[field] = amount;

      if (action === 'decrement') {
        filter[field] = { $gt: 0 };
      }
    });

    const updatedUser = await User.findOneAndUpdate(
      filter,
      { $inc: updateQuery },
      { returnDocument: 'after', runValidators: true },
    ).lean();

    if (!updatedUser) {
      throw new BadRequestError(ERROR_KEYS.USER.UPDATE_FAILED, {
        reason: 'Cannot decrement count below zero or user not found',
      });
    }

    return updatedUser;
  },
};
