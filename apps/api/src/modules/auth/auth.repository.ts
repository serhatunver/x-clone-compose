import { config } from '#/config/config.js';
import User, {
  USER_STATUS_VALUES,
  USER_STATUS,
  type UserStatus,
} from '#/modules/user/user.model.js';
import type { RegisterInput } from '@repo/shared';
import { redis, redisDb } from '#/lib/db/redis.js';

const authConfig = config.auth;

export const authRepository = {
  async findById(userId: string) {
    return User.findById(userId)
      .where({ status: { $in: USER_STATUS_VALUES } })
      .lean();
  },

  async findByUsername(username: string) {
    return User.findOne({ username }).setOptions({ allStatus: true }).lean();
  },

  async findByEmail(email: string) {
    return User.findOne({ email }).setOptions({ allStatus: true }).lean();
  },

  async findDuplicateUser(username: string, email: string) {
    return User.findOne({
      $or: [{ username }, { email }],
    })
      .setOptions({ allStatus: true })
      .lean();
  },

  async findByIdentifier(identifier: string) {
    return User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    })
      .setOptions({ allStatus: true })
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
    const user = await User.findOne({
      _id: userId,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED] },
    });

    if (!user) return null;

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;

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
    return User.findOneAndUpdate(
      { _id: userId, status: USER_STATUS.DEACTIVATED },
      { $set: { status: USER_STATUS.ACTIVE }, $unset: { deactivatedAt: 1 } },
      { returnDocument: 'after' },
    ).lean();
  },

  /**
   * Update user with reset password tokens
   */
  async setResetToken(
    userId: string,
    data: { hashedToken: string; expires: Date; lastSentAt: Date },
  ) {
    return User.findOneAndUpdate(
      { _id: userId, status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED] } },
      {
        $set: {
          passwordResetToken: data.hashedToken,
          passwordResetExpires: data.expires,
          passwordResetLastSentAt: data.lastSentAt,
        },
      },
      { returnDocument: 'after', validateBeforeSave: false },
    ).lean();
  },

  /**
   * Find user by valid reset token
   */
  async findByValidResetToken(hashedToken: string) {
    return User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // Check if not expired
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED] },
    }).lean();
  },

  /**
   * Increment user's token version to invalidate all existing tokens (used for logout all devices and token reuse detection)
   */
  async incrementTokenVersion(userId: string) {
    return User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }).lean();
  },

  async blacklistToken(jti: string, exp: number) {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;
    if (ttl > 0) {
      await redis.set(`bl:${jti}`, 'true', 'EX', ttl);
    }
  },

  async isTokenBlacklisted(jti: string) {
    const result = await redis.get(`bl:${jti}`);
    return result === 'true';
  },

  async saveSession(jti: string, rtid: string, ttl: number) {
    return await redis.set(`session:${jti}`, rtid, 'EX', ttl);
  },

  async getSession(jti: string) {
    return await redis.get(`session:${jti}`);
  },

  async deleteSession(jti: string) {
    return await redis.del(`session:${jti}`);
  },

  async getCachedAuthUser(userId: string) {
    const cacheKey = `user:auth:${userId}`;
    return await redisDb.getJson<{ v: number; s: UserStatus }>(cacheKey);
  },

  async setCachedAuthUser(userId: string, data: { v: number; s: string }) {
    const cacheKey = `user:auth:${userId}`;
    return await redisDb.setJson(cacheKey, data, authConfig.jwt.access.expiresIn);
  },
};
