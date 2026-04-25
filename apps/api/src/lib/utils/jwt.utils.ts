// import { randomUUID } from 'node:crypto';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { config } from '#/config/config.js';

const { access, refresh } = config.auth.jwt;
const ACCESS_SECRET = new TextEncoder().encode(access.secret);
const REFRESH_SECRET = new TextEncoder().encode(refresh.secret);

interface AccessTokenPayload extends JWTPayload {
  username: string;
  tokenVersion: number;
}

/** Generate a JWT access token for a user
 * @param userId - The user's unique identifier
 * @param username - The user's username
 * @param tokenVersion - The current token version for the user (used for invalidation)
 * @returns A signed JWT access token as a string
 */
export const generateAccessToken = async (
  userId: string,
  username: string,
  tokenVersion: number,
  jti: string,
): Promise<string> => {
  const payload: AccessTokenPayload = {
    username,
    tokenVersion,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + access.expiresIn)
    .sign(ACCESS_SECRET);
};

/** Generate a JWT refresh token for a user
 * @param userId - The user's unique identifier
 * @returns A signed JWT refresh token as a string
 */
export const generateRefreshToken = async (
  userId: string,
  jti: string,
  rtid: string,
): Promise<string> => {
  return await new SignJWT({ rtid })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + refresh.expiresIn)
    .sign(REFRESH_SECRET);
};

/**
 * Generate a JWT token for a user * @param userId - The user's unique identifier
 * @param username - The user's username
 * @returns A signed JWT token as a string
 */
export const generateAuthTokens = async (
  userId: string,
  username: string,
  tokenVersion: number,
  jti: string,
  rtid: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(userId, username, tokenVersion, jti),
    generateRefreshToken(userId, jti, rtid),
  ]);

  return { accessToken, refreshToken };
};

/** Verify a JWT access token and return its payload
 * @param token - The JWT access token to verify
 * @returns The decoded payload of the token if valid
 * @throws An error if the token is invalid or expired
 */
export const verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as AccessTokenPayload;
};

/** Verify a JWT refresh token and return its payload
 * @param token - The JWT refresh token to verify
 * @returns The decoded payload of the token if valid
 * @throws An error if the token is invalid or expired
 */
export const verifyRefreshToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload;
};
