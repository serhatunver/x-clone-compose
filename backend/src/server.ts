import app from './app.js';
import { config } from '#/config/config.js';
import connectMongo from '#/db/connectMongo.js';
import mongoose from 'mongoose';

async function startServer() {
  try {
    await connectMongo();

    const server = app.listen(config.app.port, '0.0.0.0', () => {
      console.log(`Server is running on port ${config.app.port} in ${config.app.nodeEnv} mode`);
    });

    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`${signal} received. Starting graceful shutdown...`);

      const forceExit = setTimeout(() => {
        console.error('Shutdown timed out, forcing exit.');
        process.exit(1);
      }, 5000);

      try {
        const closePromise = new Promise<void>((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
        });

        if (server.closeIdleConnections) {
          server.closeIdleConnections();
        }

        await closePromise;
        console.log('HTTP server closed.');

        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close();
          console.log('MongoDB connection closed.');
        }

        clearTimeout(forceExit);
        console.log('Graceful shutdown completed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    // Signal listeners
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Startup Error:', error);
    process.exit(1);
  }
}

startServer();
