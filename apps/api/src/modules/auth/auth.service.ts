import { authRepository } from './auth.repository.js';
import {
  comparePassword,
  checkNeedsRehash,
  generateAuthToken,
  generateHashedToken,
  hashToken,
  isInCooldown,
  sanitizeUser,
  checkUserStatus,
} from '#/lib/utils/index.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '#/lib/errors/index.js';
import { type RegisterInput, type LoginInput, RESPONSE_KEYS } from '@repo/shared';
import { logger } from '#/lib/utils/logger.js';
import { USER_STATUS } from '#/modules/user/user.model.js';
import { config } from '#/config/config.js';

const authConfig = config.auth;

const sendVerificationEmail = (email: string, token: string) => {
  logger.info(`[MAIL MOCK] Verification email sent to ${email}. Token: ${token}`);
};

// const sendResetEmail = async (email: string, token: string) => {
//   logger.info(`[MAIL MOCK] Password reset email sent to ${email}. Token: ${token}`);
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
    const expires = new Date(Date.now() + authConfig.verificationToken.expiresIn);
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

    let responseMessage: string = RESPONSE_KEYS.SUCCESS.AUTH.LOGIN;
    if (user.status === USER_STATUS.DEACTIVATED) {
      const updatedUser = await authRepository.activateUser(user._id.toString());
      if (updatedUser) {
        Object.assign(user, updatedUser);
        responseMessage = RESPONSE_KEYS.SUCCESS.AUTH.ACCOUNT_REACTIVATED;
      }
    }

    checkUserStatus(user.status, user.email);

    const needsRehash = checkNeedsRehash(user.password);
    if (needsRehash) {
      await authRepository.rehashUserPassword(user._id.toString(), data.password);
    }

    const token = await generateAuthToken(
      user._id.toString(),
      user.username,
      // user.tokenVersion
    );

    return { token, user: sanitizeUser(user), message: responseMessage };
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

    const isCoolingDown = isInCooldown(
      user.emailVerificationLastSentAt,
      authConfig.verificationToken.resendCooldown,
    );

    if (isCoolingDown) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.TOO_MANY_ATTEMPTS);
    }

    const { rawToken, hashedToken } = generateHashedToken();
    const expires = new Date(Date.now() + authConfig.verificationToken.expiresIn);
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

    if (user.status !== USER_STATUS.ACTIVE) {
      return genericResponse;
    }

    const isCoolingDown = isInCooldown(
      user.passwordResetLastSentAt,
      authConfig.resetToken.resendCooldown,
    );

    if (isCoolingDown) {
      return genericResponse;
    }

    const { rawToken, hashedToken } = generateHashedToken();

    await authRepository.setResetToken(user._id.toString(), {
      hashedToken,
      expires: new Date(Date.now() + authConfig.resetToken.expiresIn),
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

    let accountReactivated = false;

    const result = await authRepository.updatePassword(user._id.toString(), password);
    if (!result) {
      throw new BadRequestError(RESPONSE_KEYS.ERROR.AUTH.PASSWORD_RESET_FAILED, {
        detail: 'Failed to reset password',
      });
    }

    const { user: updatedUser, wasDeactivated } = result;

    if (wasDeactivated) {
      accountReactivated = true;
    }

    const responseMessage = accountReactivated
      ? RESPONSE_KEYS.SUCCESS.AUTH.ACCOUNT_REACTIVATED
      : RESPONSE_KEYS.SUCCESS.AUTH.PASSWORD_CHANGED;

    return { message: responseMessage, user: sanitizeUser(updatedUser) };
  },
};
