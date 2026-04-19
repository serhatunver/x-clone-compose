import { randomBytes, createHash } from 'node:crypto';

/**
 * Generate a secure random token and its hashed version
 * @returns An object containing the raw token and its hashed version
 */
export const generateHashedToken = () => {
  const rawToken = randomBytes(32).toString('hex');
  const hashedToken = createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
};

/**
 * Hash a given token using SHA-256
 * @param token - The token to be hashed
 * @returns The hashed version of the token
 */
export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};

/**
 * Check if a token is in cooldown period based on last sent time and cooldown duration
 * @param lastSentAt - The date when the token was last sent
 * @param cooldownTime - The cooldown duration in milliseconds
 * @returns True if the token is in cooldown, false otherwise
 */
export const isInCooldown = (lastSentAt: Date | undefined, cooldownTime: number) => {
  if (!lastSentAt) return false;
  return Date.now() - lastSentAt.getTime() < cooldownTime;
};
