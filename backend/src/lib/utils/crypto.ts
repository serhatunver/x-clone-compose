import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const argon2Async = promisify(argon2);

const ARGON2_CONFIG = {
  parallelism: 4,
  memory: 65536, // 64 MB
  passes: 3,
  tagLength: 32,
};

// Hash password using Argon2id
export const hashPassword = async (password: string): Promise<string> => {
  const nonce = randomBytes(16);
  const derivedKey = await argon2Async('argon2id', {
    message: password,
    nonce,
    ...ARGON2_CONFIG,
  });
  return `${nonce.toString('hex')}:${derivedKey.toString('hex')}`;
};

// Compare a plaintext password with a stored hash
export const comparePassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    const [nonceHex, hashHex] = storedHash.split(':');
    const nonce = Buffer.from(nonceHex, 'hex');
    const originalHash = Buffer.from(hashHex, 'hex');

    const derivedKey = await argon2Async('argon2id', {
      message: password,
      nonce,
      ...ARGON2_CONFIG,
    });

    return timingSafeEqual(originalHash, derivedKey);
  } catch (error) {
    return false;
  }
};
