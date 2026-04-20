import User, { USER_STATUS_VALUES, USER_STATUS } from '#/modules/user/user.model.js';
import type { RegisterInput } from '@repo/shared';

export const authRepository = {
  async findById(userId: string) {
    return User.findById(userId).lean();
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

  async updatePassword(userId: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    user.password = newPassword;
    return user.save();
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
