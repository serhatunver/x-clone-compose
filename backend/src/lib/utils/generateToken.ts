import { config } from '#/config/config.js';
import * as jose from 'jose';
import { Types } from 'mongoose';

const generateToken = async (userId: Types.ObjectId, username: string): Promise<string> => {
  const secretKey = new TextEncoder().encode(config.auth.jwtSecret);

  const token = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId.toString())
    .setIssuedAt()
    .setExpirationTime(config.auth.jwtExpiresIn)
    .sign(secretKey);

  return token;
};

export default generateToken;
