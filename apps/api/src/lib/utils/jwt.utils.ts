import { randomUUID } from 'node:crypto';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { config } from '#/config/config.js';

const { access, refresh } = config.auth.jwt;
const ACCESS_SECRET = new TextEncoder().encode(access.secret);
const REFRESH_SECRET = new TextEncoder().encode(refresh.secret);

interface AuthTokenPayload extends JWTPayload {
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
): Promise<string> => {
  const jti = randomUUID();

  return await new SignJWT({ username, tokenVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(access.expiresIn)
    .sign(ACCESS_SECRET);
};

/** Generate a JWT refresh token for a user
 * @param userId - The user's unique identifier
 * @returns A signed JWT refresh token as a string
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const jti = randomUUID();

  return await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(refresh.expiresIn)
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
): Promise<{ accessToken: string; refreshToken: string }> => {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(userId, username, tokenVersion),
    generateRefreshToken(userId),
  ]);

  return { accessToken, refreshToken };
};

/** Verify a JWT access token and return its payload
 * @param token - The JWT access token to verify
 * @returns The decoded payload of the token if valid
 * @throws An error if the token is invalid or expired
 */
export const verifyAccessToken = async (token: string): Promise<AuthTokenPayload> => {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as AuthTokenPayload;
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
