import { Worker } from 'bullmq';
import { redis } from '#/lib/db/redis.js';
import { emailService } from '#/lib/services/email.service.js';
import { logger } from '#/lib/utils/logger.js';
import { config } from '#/config/config.js';

const emailQueueConfig = config.queues.email;

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export const emailWorker = new Worker<EmailJobData>(
  emailQueueConfig.name,
  async (job) => {
    const { to, subject, html } = job.data;

    logger.info({ jobId: job.id, to }, 'Worker: Processing email job');

    await emailService.sendEmail({ to, subject, html });
  },
  {
    connection: redis,
    ...emailQueueConfig.worker,
  },
);

emailWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Worker: Job completed successfully');
});

emailWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Worker: Job failed');
});
