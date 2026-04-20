import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { RESPONSE_KEYS } from '@repo/shared';
import { InternalServerError, UnauthorizedError } from '#/lib/utils/error.handler.js';
import { verifyAuthToken, checkUserStatus } from '#/lib/utils/auth.utils.js';
import { authRepository } from '#/modules/auth/auth.repository.js';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['auth.token'];

    if (!token) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.UNAUTHORIZED, {
        detail: 'No token provided in cookies',
      });
    }

    const payload = await verifyAuthToken(token);

    if (!payload.sub) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
        detail: 'Invalid token payload: missing sub',
      });
    }

    const user = await authRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.USER_NOT_FOUND, {
        detail: 'User not found in database',
      });
    }

    checkUserStatus(user.status, user.email);

    // TODO Implement token versioning for invalidation
    // if (payload.tokenVersion !== user.tokenVersion) {
    //   throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
    //     detail: 'Token has been invalidated',
    //   });
    // }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
    };

    return next();
  } catch (error) {
    // Handle specific JWT errors from jose
    if (error instanceof jose.errors.JWTExpired) {
      return next(new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_EXPIRED));
    }

    if (error instanceof jose.errors.JOSEError) {
      return next(
        new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
          detail: error.message,
        }),
      );
    }

    // If it's already one of our custom errors, just pass it to global handler
    if (error instanceof Error) {
      return next(error);
    }

    next(new InternalServerError(RESPONSE_KEYS.ERROR.SYSTEM.INTERNAL_SERVER_ERROR));
  }
};
