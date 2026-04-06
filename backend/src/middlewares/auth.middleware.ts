import type { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { UnauthorizedError, InternalServerError } from '#/lib/utils/error.handler.js';
import { authRepository } from '#/modules/auth/auth.repository.js';
import { verifyToken } from '#/lib/utils/auth.utils.js';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['auth.token'];

    if (!token) {
      throw new UnauthorizedError('Unauthorized: No Token Provided');
    }

    const payload = await verifyToken(token);

    if (!payload.sub) {
      throw new UnauthorizedError('Unauthorized: Invalid token payload');
    }

    const user = await authRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedError('Unauthorized: User Not Found');
    }

    // TODO Implement token versioning for invalidation
    // if (payload.tokenVersion !== user.tokenVersion) {
    //   throw new UnauthorizedError('Unauthorized: Token has been invalidated');
    // }

    req.user = {
      _id: user._id,
      username: user.username,
    };

    return next();
  } catch (error) {
    // Handle specific JWT errors from jose
    if (error instanceof jose.errors.JOSEError) {
      return next(new UnauthorizedError('Invalid or expired token', { code: error.code }));
    }

    // If it's already one of our custom errors, just pass it to global handler
    if (error instanceof Error) {
      return next(error);
    }

    next(new InternalServerError('An unexpected error occurred during authentication'));
  }
};
