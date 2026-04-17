import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { ERROR_KEYS } from '@repo/shared';
import { InternalServerError, UnauthorizedError } from '#/lib/utils/error.handler.js';
import { verifyToken } from '#/lib/utils/auth.utils.js';
import { authRepository } from '#/modules/auth/auth.repository.js';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['auth.token'];

    if (!token) {
      throw new UnauthorizedError(ERROR_KEYS.AUTH.UNAUTHORIZED, {
        detail: 'No token provided in cookies',
      });
    }

    const payload = await verifyToken(token);

    if (!payload.sub) {
      throw new UnauthorizedError(ERROR_KEYS.AUTH.TOKEN_INVALID, {
        detail: 'Invalid token payload: missing sub',
      });
    }

    const user = await authRepository.findById(payload.sub);

    if (!user) {
      if (!user) {
        throw new UnauthorizedError(ERROR_KEYS.AUTH.USER_NOT_FOUND, {
          detail: 'User not found in database',
        });
      }
    }

    // TODO Implement token versioning for invalidation
    // if (payload.tokenVersion !== user.tokenVersion) {
    //   throw new UnauthorizedError(ERROR_KEYS.AUTH.TOKEN_INVALID, {
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
      return next(new UnauthorizedError(ERROR_KEYS.AUTH.TOKEN_EXPIRED));
    }

    if (error instanceof jose.errors.JOSEError) {
      return next(
        new UnauthorizedError(ERROR_KEYS.AUTH.TOKEN_INVALID, {
          detail: error.message,
        }),
      );
    }

    // If it's already one of our custom errors, just pass it to global handler
    if (error instanceof Error) {
      return next(error);
    }

    next(new InternalServerError(ERROR_KEYS.SYSTEM.INTERNAL_SERVER_ERROR));
  }
};
