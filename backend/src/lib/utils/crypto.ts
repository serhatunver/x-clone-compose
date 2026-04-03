import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { logger } from '#/lib/utils/logger.js';

const argon2Async = promisify(argon2);

const ARGON2_CONFIG = {
  parallelism: 4,
  memory: 65536, // 64 MB
  passes: 3,
  tagLength: 32,
} as const;

/**
 * Hash a plaintext password using Argon2id
 * @param password - The plaintext password to hash
 * @returns A string containing the nonce and hash, separated by a colon
 */

export const hashPassword = async (password: string): Promise<string> => {
  const nonce = randomBytes(16);

  const derivedKey = await argon2Async('argon2id', {
    message: password,
    nonce,
    ...ARGON2_CONFIG,
  });

  return `${nonce.toString('hex')}:${derivedKey.toString('hex')}`;
};

/** Compare a plaintext password with a stored hash
 * @param password - The plaintext password to compare
 * @param storedHash - The stored hash in the format "nonce:hash"
 * @returns A boolean indicating whether the password matches the hash
 */

export const comparePassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    if (!storedHash.includes(':')) {
      logger.warn('Invalid stored hash format');
      return false;
    }

    const [nonceHex, hashHex] = storedHash.split(':');

    if (!nonceHex || !hashHex) {
      logger.warn('Missing nonce or hash in stored hash');
      return false;
    }

    const nonce = Buffer.from(nonceHex, 'hex');
    const originalHash = Buffer.from(hashHex, 'hex');

    const derivedKey = await argon2Async('argon2id', {
      message: password,
      nonce,
      ...ARGON2_CONFIG,
    });

    return timingSafeEqual(originalHash, derivedKey);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Error comparing password: ${errMsg}`);
    return false;
  }
};
