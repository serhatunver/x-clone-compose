import User from '#/modules/user/user.model.js';
import type { RegisterInput } from '@repo/shared';

export const authRepository = {
  async findById(userId: string) {
    return User.findById(userId).lean();
  },

  async findByUsername(username: string) {
    return User.findOne({ username }).lean();
  },

  async findByEmail(email: string) {
    return User.findOne({ email }).lean();
  },

  async findByIdentifier(identifier: string) {
    return User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
      status: { $ne: 'deactivated' },
    }).select('+password');
  },

  async createUser(data: RegisterInput) {
    return User.create(data);
  },

  /**
   * Update user with reset password tokens
   */
  async setResetToken(
    userId: string,
    data: { hashedToken: string; expires: Date; lastSent: Date },
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        passwordResetToken: data.hashedToken,
        passwordResetExpires: data.expires,
        passwordResetLastSentAt: data.lastSent,
      },
      { returnDocument: 'after', validateBeforeSave: false },
    );
  },

  /**
   * Find user by valid reset token
   */
  async findByValidResetToken(hashedToken: string) {
    return User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // Check if not expired
    });
  },
};
