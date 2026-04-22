import * as jose from 'jose';
import { config } from '#/config/config.js';

const jwtConfig = config.auth.jwt;

const JWT_SECRET = new TextEncoder().encode(jwtConfig.secret);

/**
 * Generate a JWT token for a user * @param userId - The user's unique identifier
 * @param username - The user's username
 * @returns A signed JWT token as a string
 */

export const generateAuthToken = async (
  userId: string,
  username: string,
  tokenVersion: number,
): Promise<string> => {
  const token = await new jose.SignJWT({
    username,
    tokenVersion,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(jwtConfig.expiresIn)
    .sign(JWT_SECRET);

  return token;
};

/**
 * Verify a JWT token and return its payload
 * @param token - The JWT token to verify
 * @returns The payload of the token if valid, otherwise throws an error
 */

export const verifyAuthToken = async (token: string) => {
  const { payload } = await jose.jwtVerify(token, JWT_SECRET);
  return payload;
};
