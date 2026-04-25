import { redis, redisDb } from '#/lib/db/redis.js';
import { config } from '#/config/config.js';
import type { UserStatus } from '#/modules/user/user.model.js';

const authConfig = config.auth;

export const sessionRepository = {
  /** Blacklist a JWT token by its JTI until its expiration time
   * @param jti - The unique identifier of the JWT token to blacklist
   * @param exp - The expiration time of the token (as a UNIX timestamp)
   */
  async blacklistToken(jti: string, exp: number) {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;
    if (ttl > 0) {
      await redis.set(`bl:${jti}`, 'true', 'EX', ttl);
    }
  },

  /**
   * Check if a JWT token's JTI is blacklisted
   * @param jti - The unique identifier of the JWT token to check
   * @returns A boolean indicating whether the token is blacklisted
   */
  async isTokenBlacklisted(jti: string) {
    const result = await redis.get(`bl:${jti}`);
    return result === 'true';
  },

  /**
   * Save a valid refresh token's JTI and RTID in Redis for session management and token reuse detection
   * @param jti - The unique identifier of the JWT token
   * @param rtid - The unique identifier of the refresh token (stored in JWT payload)
   * @param ttl - Time to live for the session in seconds (should match refresh token expiration)
   */
  async saveSession(jti: string, rtid: string, ttl: number) {
    return await redis.set(`session:${jti}`, rtid, 'EX', ttl);
  },

  /**
   * Retrieve the RTID associated with a given JTI from Redis to validate refresh token sessions
   * @param jti - The unique identifier of the JWT token
   * @returns The RTID associated with the JTI, or null if not found
   */
  async getSession(jti: string) {
    return await redis.get(`session:${jti}`);
  },

  /**
   * Delete a refresh token session from Redis (used during logout and token reuse handling)
   * @param jti - The unique identifier of the JWT token whose session should be deleted
   */
  async deleteSession(jti: string) {
    return await redis.del(`session:${jti}`);
  },

  /**
   * Get cached authentication-related user data from Redis (used for quick token validation without DB lookup)
   * @param userId - The unique identifier of the user
   * @returns An object containing the token version and user status, or null if not found in cache
   */
  async getCachedAuthUser(userId: string) {
    const cacheKey = `user:auth:${userId}`;
    return await redisDb.getJson<{ v: number; s: UserStatus }>(cacheKey);
  },

  /**
   * Set cached authentication-related user data in Redis (used after login or when user status changes to keep cache updated)
   * @param userId - The unique identifier of the user
   * @param data - An object containing the token version and user status to cache
   */
  async setCachedAuthUser(userId: string, data: { v: number; s: string }) {
    const cacheKey = `user:auth:${userId}`;
    return await redisDb.setJson(cacheKey, data, authConfig.jwt.access.expiresIn);
  },

  /**
   * Delete cached authentication-related user data from Redis (used when user logs out or when cache needs to be invalidated)
   * @param userId - The unique identifier of the user
   */
  async deleteCachedAuthUser(userId: string) {
    const cacheKey = `user:auth:${userId}`;
    return await redis.del(cacheKey);
  },
};
