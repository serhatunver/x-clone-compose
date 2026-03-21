import { config } from '#/config/config.js';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = async (userId: Types.ObjectId, username: string): Promise<string> => {
  const token = jwt.sign({ userId, username }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiresIn });

  return token;
};

export default generateToken;
