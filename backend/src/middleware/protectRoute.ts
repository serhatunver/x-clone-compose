import { config } from '#/config/config.js';
import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No Token Provided' });
    }

    const jwt_secret = config.auth.jwtSecret;

    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;

    req.user = { _id: new Types.ObjectId(decoded.userId), username: decoded.username };
    return next();
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default protectRoute;
