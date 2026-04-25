import { Redis } from 'ioredis';
import { config } from '#/config/config.js';
import { logger } from '#/lib/utils/logger.js';

export const redis = new Redis(config.database.redis.uri, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('connect', () => logger.info('Redis: Connected'));
redis.on('ready', () => logger.info('Redis: Ready'));
redis.on('close', () => logger.warn('Redis: Connection closed'));
redis.on('error', (err) => logger.error({ err }, 'Redis: Connection error'));

/**
 * A simple wrapper around Redis to handle JSON serialization and deserialization,
 * along with error handling and logging.
 */
export const redisDb = {
  connect: async () => {
    try {
      if (redis.status === 'wait') {
        await redis.connect();
      }
    } catch (err) {
      logger.error({ err }, 'Redis: Failed to connect');
    }
  },

  disconnect: async () => {
    try {
      if (redis.status !== 'end') {
        await redis.quit();
      }
    } catch (err) {
      logger.error({ err }, 'Redis: Failed to disconnect');
    }
  },

  /**
   * Set a JSON value in Redis with an expiration time.
   * @param key The Redis key
   * @param value The value to store (will be serialized to JSON)
   * @param ttlSeconds Time to live in seconds
   * @returns 'OK' if successful, or null if there was an error
   */
  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<'OK' | null> {
    try {
      const data = JSON.stringify(value);
      return await redis.set(key, data, 'EX', ttlSeconds);
    } catch (err) {
      logger.error({ err }, `Redis: setJson error for key [%s]`, key);
      return null;
    }
  },

  /**
   * Get a JSON value from Redis and parse it.
   * @param key The Redis key
   * @returns The parsed value, or null if not found or if there was an error
   */
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (err) {
      logger.error({ err }, `Redis: getJson parse error for key [%s]`, key);

      // If parsing fails, delete the corrupted key to prevent future errors
      await this.del(key);
      return null;
    }
  },

  /**
   * Delete a key from Redis.
   * @param key The Redis key to delete
   * @returns The number of keys that were removed (0 or 1)
   */
  async del(key: string): Promise<number> {
    try {
      return await redis.del(key);
    } catch (err) {
      logger.error({ err }, `Redis: del error for key [%s]`, key);
      return 0;
    }
  },

  /**
   * Delete multiple keys from Redis.
   * @param keys An array of Redis keys to delete
   * @returns The number of keys that were removed
   */
  async delMany(keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await redis.del(...keys);
  },
};
