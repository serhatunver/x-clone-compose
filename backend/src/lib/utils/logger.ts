import pino from 'pino';
import { config } from '#/config/config.js';

export const logger = pino({
  level: config.app.isProduction ? 'info' : 'debug',
  ...(config.app.isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});
