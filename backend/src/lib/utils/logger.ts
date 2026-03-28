import pino from 'pino';
import { config } from '#/config/config.js';

export const logger = pino({
  level: config.app.isProduction ? 'info' : 'debug',
  // transport: config.app.isDevelopment
  //   ? {
  //       target: 'pino-pretty',
  //       options: {
  //         colorize: true,
  //         translateTime: 'HH:MM:ss Z',
  //         ignore: 'pid,hostname,req,res',
  //       },
  //     }
  //   : undefined,

  ...(config.app.isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});
