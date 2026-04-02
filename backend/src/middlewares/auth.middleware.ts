import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import * as jose from 'jose';
import { config } from '#/config/config.js';
import { UnauthorizedError, InternalServerError } from '#/lib/utils/error.handler.js';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['auth.token'];

    if (!token) {
      throw new UnauthorizedError('Unauthorized: No Token Provided');
    }

    const secretKey = new TextEncoder().encode(config.auth.jwtSecret);

    // Verify token using jose
    const { payload } = await jose.jwtVerify(token, secretKey);

    req.user = {
      _id: new Types.ObjectId(payload.sub),
      username: payload.username as string,
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
