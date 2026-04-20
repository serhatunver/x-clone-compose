import User, { USER_STATUS_VALUES, USER_STATUS } from '#/modules/user/user.model.js';
import type { RegisterInput } from '@repo/shared';

export const authRepository = {
  async findById(userId: string) {
    return User.findById(userId)
      .where({ status: { $in: USER_STATUS_VALUES } })
      .lean();
  },

  async findByUsername(username: string) {
    return User.findOne({ username, status: { $in: USER_STATUS_VALUES } }).lean();
  },

  async findByEmail(email: string) {
    return User.findOne({ email, status: { $in: USER_STATUS_VALUES } }).lean();
  },

  async findDuplicateUser(username: string, email: string) {
    return User.findOne({
      $or: [{ username }, { email }],
      status: { $in: USER_STATUS_VALUES },
    }).lean();
  },

  async findByIdentifier(identifier: string) {
    return User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
      status: { $in: USER_STATUS_VALUES },
    })
      .select('+password')
      .lean();
  },

  async createUser(
    data: RegisterInput,
    verificatonFields: {
      hashedToken: string;
      expires: Date;
      lastSentAt: Date;
    },
  ) {
    return User.create({
      ...data,
      emailVerificationToken: verificatonFields.hashedToken,
      emailVerificationExpires: verificatonFields.expires,
      emailVerificationLastSentAt: verificatonFields.lastSentAt,
    });
  },

  /**
   * Find user by valid email verification token (for email verification process)
   */
  async findByVerificationToken(hashedToken: string) {
    return User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
      status: USER_STATUS.PENDING,
    }).select('+emailVerificationToken +emailVerificationExpires');
  },

  /**
   * Update user status to active and remove verification token fields after successful email verification
   */
  async updateVerificationStatus(userId: string) {
    return User.findOneAndUpdate(
      { _id: userId, status: USER_STATUS.PENDING },
      {
        $set: { status: 'active' },
        $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 },
      },
      { returnDocument: 'after' },
    );
  },

  /**
   * Update user with new verification token and expiry (for resending verification email)
   */
  async updateVerificationToken(
    userId: string,
    data: { hashedToken: string; expires: Date; lastSentAt: Date },
  ) {
    return User.findOneAndUpdate(
      { _id: userId, status: USER_STATUS.PENDING },
      {
        $set: {
          emailVerificationToken: data.hashedToken,
          emailVerificationExpires: data.expires,
          emailVerificationLastSentAt: data.lastSentAt,
        },
      },
    );
  },

  /**
   * Update user's password and clear reset token fields after successful password reset
   */
  async updatePassword(userId: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.password = newPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // user.tokenVersion = (user.tokenVersion || 0) + 1;

    let wasDeactivated = false;
    if (user.status === USER_STATUS.DEACTIVATED) {
      user.status = USER_STATUS.ACTIVE;
      user.deactivatedAt = undefined;
      wasDeactivated = true;
    }

    await user.save();

    return { user, wasDeactivated };
  },

  async rehashUserPassword(userId: string, plainPassword: string) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.password = plainPassword;

    return user.save();
  },

  /**
   * Activate a deactivated user account (used when a deactivated user logs in successfully)
   */
  async activateUser(userId: string) {
    return User.findOne(
      { _id: userId, status: USER_STATUS.DEACTIVATED },
      { $set: { status: USER_STATUS.ACTIVE }, $unset: { deactivatedAt: 1 } },
      { returnDocument: 'after' },
    );
  },

  /**
   * Update user with reset password tokens
   */
  async setResetToken(
    userId: string,
    data: { hashedToken: string; expires: Date; lastSentAt: Date },
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: {
          passwordResetToken: data.hashedToken,
          passwordResetExpires: data.expires,
          passwordResetLastSentAt: data.lastSentAt,
        },
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
