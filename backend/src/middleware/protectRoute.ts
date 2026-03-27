import { config } from '#/config/config.js';
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import * as jose from 'jose';

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth.token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No Token Provided' });
    }
    const secretKey = new TextEncoder().encode(config.auth.jwtSecret);

    const { payload } = await jose.jwtVerify(token, secretKey);

    req.user = {
      _id: new Types.ObjectId(payload.sub),
      username: payload.username as string,
    };

    return next();
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
      console.error({ error: error.message, code: error.code });
      return res.status(401).json({
        error: 'Unauthorized',
        code: error.code,
        message: 'Invalid or expired token',
      });
    }

    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectRoute;
