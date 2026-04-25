import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { RESPONSE_KEYS } from '@repo/shared';
import { InternalServerError, UnauthorizedError } from '#/lib/errors/index.js';
import { verifyAccessToken, checkUserStatus } from '#/lib/utils/index.js';
import { authRepository } from '#/modules/auth/auth.repository.js';
import { sessionRepository } from '#/modules/auth/session.repository.js';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['auth.token'];

    if (!token) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.UNAUTHORIZED, {
        detail: 'No token provided in cookies',
      });
    }

    const payload = await verifyAccessToken(token);
    const { sub: userId, jti, tokenVersion, exp, username } = payload;

    if (!userId || !jti || tokenVersion === undefined || !exp || !username) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID);
    }

    const isBlacklisted = await sessionRepository.isTokenBlacklisted(jti);
    if (isBlacklisted) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID);
    }

    let cachedUser = await sessionRepository.getCachedAuthUser(userId);

    if (!cachedUser) {
      const user = await authRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.USER_NOT_FOUND);
      }

      cachedUser = { v: user.tokenVersion, s: user.status };
      await sessionRepository.setCachedAuthUser(userId, cachedUser);
    }

    checkUserStatus(cachedUser.s);

    if (tokenVersion !== cachedUser.v) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
        detail: 'Token version mismatch',
      });
    }

    req.user = {
      _id: userId,
      username,
      jti,
      exp,
      tokenVersion,
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
