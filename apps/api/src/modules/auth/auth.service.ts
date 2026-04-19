import { authRepository } from './auth.repository.js';
import { comparePassword, checkNeedsRehash, generateAuthToken } from '#/lib/utils/auth.utils.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '#/lib/utils/error.handler.js';
import { type RegisterInput, type LoginInput, RESPONSE_KEYS } from '@repo/shared';
import { logger } from '#/lib/utils/logger.js';
import User, { USER_STATUS } from '#/modules/user/user.model.js';
import { generateHashedToken, hashToken } from '#/lib/utils/crypto.utils.js';

const sendVerificationEmail = (email: string, token: string) => {
  logger.info(`[MAIL MOCK] Verification email sent to ${email}. Token: ${token}`);
};

// const sendResetEmail = async (email: string, token: string) => {
//   logger.info(`[MAIL MOCK] Password reset email sent to ${email}. Token: ${token}`);
// };

// const TOKEN_EXPIRY = {
//   VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
//   RESET: 15 * 60 * 1000, // 15 minutes
// };

export const authService = {
  async register(data: RegisterInput) {
    const existing = await authRepository.findDuplicateUser(data.username, data.email);
    if (existing) {
      const isEmailConflict = existing.email === data.email;

      throw new ConflictError(
        isEmailConflict
          ? RESPONSE_KEYS.ERROR.USER.EMAIL_TAKEN
          : RESPONSE_KEYS.ERROR.USER.USERNAME_TAKEN,
        { field: isEmailConflict ? 'email' : 'username' },
      );
    }

    const { rawToken, hashedToken } = generateHashedToken();
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
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.INVALID_CREDENTIALS);
    }

    // TODO Check if user is suspended or pending verification and throw appropriate errors
    // checkUserStatus(user);

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ForbiddenError(RESPONSE_KEYS.ERROR.AUTH.ACCOUNT_SUSPENDED);
    }

    if (user.status === USER_STATUS.PENDING) {
      throw new ForbiddenError(RESPONSE_KEYS.ERROR.AUTH.EMAIL_NOT_VERIFIED, {
        email: user.email,
      });
    }

    const needsRehash = checkNeedsRehash(user.password);

    if (needsRehash) {
      const userDoc = User.hydrate(user);
      userDoc.password = data.password;
      await userDoc.save();
      logger.info(`Rehashed password for ${user.username}`);
      // await authRepository.updatePassword(user._id.toString(), data.password);
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
      throw new NotFoundError(RESPONSE_KEYS.ERROR.AUTH.USER_NOT_FOUND, {
        userId,
      });
    }
    return user;
  },

  async verifyEmail(token: string) {
    const hashedToken = hashToken(token);

    const user = await authRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID);
    }

    await authRepository.updateVerificationStatus(user._id.toString());

    return { message: 'Email verified successfully' };
  },

  async resendVerificationEmail(email: string) {
    const user = await authRepository.findByEmail(email);

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!user || user.status !== USER_STATUS.PENDING) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.USER_NOT_FOUND, { email });
    }

    const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
    if (
      user.emailVerificationLastSentAt &&
      Date.now() - user.emailVerificationLastSentAt.getTime() < COOLDOWN_TIME
    ) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.TOO_MANY_ATTEMPTS);
    }

    const { rawToken, hashedToken } = generateHashedToken();
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
      message: RESPONSE_KEYS.SUCCESS.AUTH.PASSWORD_RESET_EMAIL_SENT,
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

    const { rawToken, hashedToken } = generateHashedToken();

    await authRepository.setResetToken(user._id.toString(), {
      hashedToken,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins validity
      lastSentAt: new Date(),
    });

    // sendResetEmail(user.email, resetToken); // Implement email sending logic
    return { ...genericResponse, debugToken: rawToken };
  },

  async resetPassword(token: string, password: string) {
    const hashedToken = hashToken(token);

    const user = await authRepository.findByValidResetToken(hashedToken);
    if (!user) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
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
