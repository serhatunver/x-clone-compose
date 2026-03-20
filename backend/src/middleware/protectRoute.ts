import type { Request, Response, NextFunction } from 'express';
import User from '../users/model.js';
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

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default protectRoute;
