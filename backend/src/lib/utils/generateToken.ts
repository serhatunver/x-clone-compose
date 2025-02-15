import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import type { Response } from 'express';

const generateTokenAndSetCookie = async (userId: Types.ObjectId, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  
  return token;
};

export default generateTokenAndSetCookie;
