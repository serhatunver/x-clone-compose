import { promisify } from 'node:util';
import app from './app.js';
import { config } from '#/config/config.js';
import { db } from '#/lib/db/mongoose.js';
import { redisDb } from '#/lib/db/redis.js';
import { logger } from '#/lib/utils/logger.js';

async function startServer() {
  try {
    // 1. Database Connection
    await db.connect();
    await redisDb.connect();

    // 2. Start HTTP Server
    const server = app.listen(config.app.port, '0.0.0.0', () => {
      logger.info(`Server is running on port ${config.app.port} in ${config.app.nodeEnv} mode`);
    });

    const closeServer = promisify(server.close.bind(server));
    let isShuttingDown = false;

    /**
     * Graceful Shutdown Logic
     */
    const gracefulShutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.warn(`${signal} received. Starting graceful shutdown...`);

      // Force exit after 10 seconds if shutdown hangs
      const forceExit = setTimeout(() => {
        logger.error('Shutdown timed out, forcing exit.');
        process.exit(1);
      }, 10000);

      try {
        // Stop accepting new connections
        if (server.closeIdleConnections) {
          server.closeIdleConnections();
        }

        // Close HTTP server (Wait for current requests to finish)
        await closeServer();
        logger.info('HTTP server closed.');

        // Disconnect from Database
        await db.disconnect();
        await redisDb.disconnect();

        clearTimeout(forceExit);
        logger.info('Graceful shutdown completed. Goodbye!');
        process.exit(0);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`Error during shutdown: ${msg}`);
        process.exit(1);
      }
    };

    // Signal listeners
    process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));

    // Handle Uncaught Exceptions
    process.on('unhandledRejection', (reason: unknown) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      logger.error(`Unhandled Rejection: ${msg}`);
      void gracefulShutdown('unhandledRejection');
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Startup Error: ${msg}`);
    process.exit(1);
  }
}

await startServer();
