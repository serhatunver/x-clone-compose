import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = async (userId: Types.ObjectId, username: string): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: '15d' });

  return token;
};

export default generateToken;
