import { Redis } from 'ioredis';
import { config } from '#/config/config.js';
import { logger } from '#/lib/utils/logger.js';

export const redis = new Redis(config.database.redis.uri, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => logger.info('Redis: Connected'));
redis.on('error', (err) =>
  logger.error(`Redis: Connection error - ${err instanceof Error ? err.message : String(err)}`),
);
redis.on('reconnecting', () => logger.warn('Redis: Reconnecting...'));
redis.on('end', () => logger.warn('Redis: Connection closed'));

export const redisDb = {
  setJson: (key: string, value: unknown, ttl: number) =>
    redis.set(key, JSON.stringify(value), 'EX', ttl),

  getJson: async <T>(key: string): Promise<T | null> => {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  },

  del: (key: string) => redis.del(key),
};
