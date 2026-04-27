import { Queue } from 'bullmq';
import { redis } from '#/lib/db/redis.js';
import { logger } from '#/lib/utils/logger.js';
import { config } from '#/config/config.js';

const emailQueueConfig = config.queues.email;

export const emailQueue = new Queue(emailQueueConfig.name, {
  connection: redis,
  defaultJobOptions: emailQueueConfig.defaultJobOptions,
});

logger.info('Email Queue: Initialized');
