import crypto from 'node:crypto';
import { authRepository } from './auth.repository.js';
import { comparePassword, checkNeedsRehash, generateAuthToken } from '#/lib/utils/auth.utils.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '#/lib/utils/error.handler.js';
import { type RegisterInput, type LoginInput, ERROR_KEYS } from '@repo/shared';
import { logger } from '#/lib/utils/logger.js';
import User, { USER_STATUS } from '#/modules/user/user.model.js';

const sendVerificationEmail = (email: string, token: string) => {
  logger.info(`[MAIL MOCK] Verification email sent to ${email}. Token: ${token}`);
};

// const sendResetEmail = async (email: string, token: string) => {
//   logger.info(`[MAIL MOCK] Password reset email sent to ${email}. Token: ${token}`);
// };

// const generateRandomToken = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// const hashToken = (token: string) => {
//   return crypto.createHash('sha256').update(token).digest('hex');
// };

// const generateHashedToken = (token: string) => {
//   return crypto.createHash('sha256').update(token).digest('hex');
// };

// const TOKEN_EXPIRY = {
//   VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
//   RESET: 15 * 60 * 1000, // 15 minutes
// };

// const isInCooldown = (lastSentAt: Date | undefined, cooldownTime: number) => {
//   if (!lastSentAt) return false;
//   return Date.now() - lastSentAt.getTime() < cooldownTime;
// };

const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
};

export const authService = {
  async register(data: RegisterInput) {
    const [existingUser, existingEmail] = await Promise.all([
      authRepository.findByUsername(data.username),
      authRepository.findByEmail(data.email),
    ]);

    if (existingUser) {
      throw new ConflictError(ERROR_KEYS.USER.USERNAME_TAKEN, { username: data.username });
    }
    if (existingEmail) {
      throw new ConflictError(ERROR_KEYS.USER.EMAIL_TAKEN, { email: data.email });
    }

    const { rawToken, hashedToken } = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    const lastSentAt = new Date();

    const newUser = await authRepository.createUser(data, {
      hashedToken,
      expires,
      lastSentAt,
    });

    sendVerificationEmail(newUser.email, rawToken);

    return {
      user: newUser,
      debugToken: rawToken,
    };
  },

  async login(data: LoginInput) {
    const user = await authRepository.findByIdentifier(data.identifier);

    if (!user || !(await comparePassword(data.password, user.password))) {
      logger.warn(`Failed login attempt for identifier: ${data.identifier}`);
      throw new UnauthorizedError(ERROR_KEYS.AUTH.INVALID_CREDENTIALS, {
        identifier: data.identifier,
      });
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ForbiddenError(ERROR_KEYS.AUTH.ACCOUNT_SUSPENDED);
    }

    if (user.status === USER_STATUS.PENDING) {
      throw new ForbiddenError(ERROR_KEYS.AUTH.EMAIL_NOT_VERIFIED, {
        email: user.email,
      });
    }

    const needsRehash = checkNeedsRehash(user.password);

    if (needsRehash) {
      const userDoc = User.hydrate(user);
      userDoc.password = data.password;
      await userDoc.save();
      logger.info(`Rehashed password for ${user.username}`);
    }

    const token = await generateAuthToken(
      user._id,
      user.username,
      // user.tokenVersion
    );

    const { password: _password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_KEYS.AUTH.USER_NOT_FOUND, {
        userId,
      });
    }
    return user;
  },

  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await authRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw new BadRequestError(ERROR_KEYS.AUTH.TOKEN_INVALID);
    }

    await authRepository.updateVerificationStatus(user._id.toString());

    return { message: 'Email verified successfully' };
  },

  async resendVerificationEmail(email: string) {
    const user = await authRepository.findByEmail(email);

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!user || user.status !== USER_STATUS.PENDING) {
      return {
        message: ERROR_KEYS.AUTH.VERIFICATION_EMAIL_SENT,
      };
    }

    const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
    if (
      user.emailVerificationLastSentAt &&
      Date.now() - user.emailVerificationLastSentAt.getTime() < COOLDOWN_TIME
    ) {
      throw new BadRequestError(ERROR_KEYS.AUTH.TOO_MANY_ATTEMPTS);
    }

    const { rawToken, hashedToken } = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    const lastSentAt = new Date();

    await authRepository.updateVerificationToken(user._id.toString(), {
      hashedToken,
      expires,
      lastSentAt,
    });

    sendVerificationEmail(user.email, rawToken);

    return { message: 'Verification email resent successfully', debugToken: rawToken };
  },

  async forgotPassword(email: string): Promise<{ message: string; debugToken?: string }> {
    const user = await authRepository.findByEmail(email);

    // Security: Generic message
    const genericResponse = {
      message: ERROR_KEYS.AUTH.PASSWORD_RESET_EMAIL_SENT,
    };
    if (!user) return genericResponse;

    if (user.status !== 'active') {
      return genericResponse;
    }

    // Cooldown Check: 5 Minutes
    const COOLDOWN_TIME = 5 * 60 * 1000;
    if (
      user.passwordResetLastSentAt &&
      Date.now() - user.passwordResetLastSentAt.getTime() < COOLDOWN_TIME
    ) {
      return genericResponse;
    }

    const { rawToken, hashedToken } = generateToken();

    await authRepository.setResetToken(user._id.toString(), {
      hashedToken,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins validity
      lastSentAt: new Date(),
    });

    // sendResetEmail(user.email, resetToken); // Implement email sending logic
    return { ...genericResponse, debugToken: rawToken };
  },

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await authRepository.findByValidResetToken(hashedToken);
    if (!user) {
      throw new BadRequestError(ERROR_KEYS.AUTH.TOKEN_INVALID, {
        detail: 'Token is invalid or has expired',
      });
    }

    // Update password and clear reset fields
    user.password = password;

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // TODO Invalidate existing tokens by incrementing tokenVersion
    // user.tokenVersion = (user.tokenVersion || 0) + 1;

    // if (user.status == USER_STATUS.DEACTIVATED) {
    //   user.status = USER_STATUS.ACTIVE;
    // }

    // Save triggers the 'pre-save' hook to hash the new password
    await user.save();

    return { message: 'Password reset successful' };
  },
};
