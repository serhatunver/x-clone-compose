import {
  USER_STATUS,
  type IUser,
  type UserDocument,
  type UserStatus,
} from '#/modules/user/user.model.js';
import { ForbiddenError } from '#/lib/errors/index.js';
import { RESPONSE_KEYS } from '@repo/shared';

/**
 * Sanitize a user object by removing sensitive fields before sending it in a response
 * @param user - The user document to sanitize
 * @returns A sanitized user object with sensitive fields removed
 */

export const sanitizeUser = (user: IUser | UserDocument) => {
  if (!user) return null;

  const userObj = 'toObject' in user ? user.toObject() : user;

  const {
    password: _password,
    emailVerificationToken: _emailVerificationToken,
    emailVerificationExpires: _emailVerificationExpires,
    passwordResetToken: _passwordResetToken,
    passwordResetExpires: _passwordResetExpires,
    __v,
    ...sanitizedUser
  } = userObj;

  return sanitizedUser;
};

/** * Check a user's account status and throw appropriate errors if the account is not active
 * @param status - The user's account status
 * @param email - The user's email (optional, used for error messages)
 * @throws ForbiddenError if the account is suspended or pending verification
 */

export const checkUserStatus = (status: UserStatus, email?: string) => {
  if (status === USER_STATUS.SUSPENDED) {
    throw new ForbiddenError(RESPONSE_KEYS.ERROR.AUTH.ACCOUNT_SUSPENDED);
  }

  if (status === USER_STATUS.PENDING) {
    throw new ForbiddenError(RESPONSE_KEYS.ERROR.AUTH.EMAIL_NOT_VERIFIED, {
      email: email,
    });
  }

  if (status !== USER_STATUS.ACTIVE) {
    throw new ForbiddenError(RESPONSE_KEYS.ERROR.AUTH.INVALID_ACCOUNT_STATUS);
  }
};
