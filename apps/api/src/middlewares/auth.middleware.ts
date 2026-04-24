import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { RESPONSE_KEYS } from '@repo/shared';
import { InternalServerError, UnauthorizedError } from '#/lib/errors/index.js';
import { verifyAccessToken, checkUserStatus } from '#/lib/utils/index.js';
import { authRepository } from '#/modules/auth/auth.repository.js';
import { redis, redisDb } from '#/lib/db/redis.js';
import type { UserStatus } from '#/modules/user/user.model.js';

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

    const userId = payload.sub;
    const jti = payload.jti;

    if (!userId || !jti) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID);
    }

    const isBlacklisted = await redis.get(`bl:${jti}`);
    if (isBlacklisted) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID);
    }

    const cacheKey = `user:auth:${userId}`;
    let cachedUser = await redisDb.getJson<{ v: number; s: UserStatus }>(cacheKey);

    if (!cachedUser) {
      const user = await authRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.USER_NOT_FOUND);
      }

      cachedUser = { v: user.tokenVersion, s: user.status };
      await redisDb.setJson(cacheKey, cachedUser, 900); // Cache for 15 minutes
    }

    checkUserStatus(cachedUser.s);

    if (payload.tokenVersion !== cachedUser.v) {
      throw new UnauthorizedError(RESPONSE_KEYS.ERROR.AUTH.TOKEN_INVALID, {
        detail: 'Token version mismatch',
      });
    }

    req.user = {
      _id: userId,
      username: payload.username,
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
