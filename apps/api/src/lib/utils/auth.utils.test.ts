import { describe, it, expect } from 'vitest';
import { Types } from 'mongoose';
import {
  hashPassword,
  comparePassword,
  checkNeedsRehash,
  generateAuthToken,
  verifyToken,
} from './auth.utils.js';

describe('Auth Utilities', () => {
  const RAW_PASSWORD = 'super-secret-password-123';
  const MOCK_USER_ID = new Types.ObjectId();
  const MOCK_USERNAME = 'vitest_user';

  describe('Argon2 Password Hashing', () => {
    it('should generate a valid hash starting with the correct algorithm identifier', async () => {
      const hash = await hashPassword(RAW_PASSWORD);

      expect(hash.startsWith('$argon2id$')).toBe(true);
      expect(hash.split('$')).toHaveLength(6);
    });

    it('should verify a correct password against a generated hash', async () => {
      const hash = await hashPassword(RAW_PASSWORD);
      const isValid = await comparePassword(RAW_PASSWORD, hash);

      expect(isValid).toBe(true);
    });

    it('should return false for incorrect passwords', async () => {
      const hash = await hashPassword(RAW_PASSWORD);
      const isValid = await comparePassword('wrong-password', hash);

      expect(isValid).toBe(false);
    });

    it('should return false for malformed hash strings', async () => {
      const isValid = await comparePassword(RAW_PASSWORD, 'not-a-valid-argon2-hash');
      expect(isValid).toBe(false);
    });

    it('should reject hashes with out-of-bounds parameters', async () => {
      // Manual hash with memory (m=1024) below MIN_MEMORY (8192)
      const weakHash = '$argon2id$v=19$m=1024,t=2,p=1$bm9uY2U$aGFzaA';
      const isValid = await comparePassword(RAW_PASSWORD, weakHash);

      expect(isValid).toBe(false);
    });
  });

  describe('Rehash Logic', () => {
    it('should not require rehash for current configuration', async () => {
      const hash = await hashPassword(RAW_PASSWORD);
      expect(checkNeedsRehash(hash)).toBe(false);
    });

    it('should require rehash if the algorithm differs', () => {
      const legacyHash = '$argon2i$v=19$m=16384,t=2,p=1$bm9uY2U$aGFzaA';
      expect(checkNeedsRehash(legacyHash)).toBe(true);
    });

    it('should require rehash if parameters are outdated', () => {
      const outdatedParamsHash = '$argon2id$v=19$m=4096,t=1,p=1$bm9uY2U$aGFzaA';
      expect(checkNeedsRehash(outdatedParamsHash)).toBe(true);
    });
  });

  describe('JWT Operations', () => {
    it('should sign and successfully verify a token', async () => {
      const token = await generateAuthToken(MOCK_USER_ID, MOCK_USERNAME);
      const payload = await verifyToken(token);

      expect(payload.sub).toBe(MOCK_USER_ID.toString());
      expect(payload.username).toBe(MOCK_USERNAME);
    });

    it('should fail verification for tampered tokens', async () => {
      const token = await generateAuthToken(MOCK_USER_ID, MOCK_USERNAME);
      const tamperedToken = token + 'manipulated';

      await expect(verifyToken(tamperedToken)).rejects.toThrow();
    });
  });
});
