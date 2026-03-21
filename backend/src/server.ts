import app from './app.js';
import { config } from '#/config/config.js';
import connectMongo from './db/connectMongo.js';

async function startServer() {
  try {
    await connectMongo();

    const server = app.listen(config.app.port, '0.0.0.0', () => {
      console.log(`Server is running on port ${config.app.port} in ${config.app.nodeEnv} mode`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error('Startup Error:', error);
    process.exit(1);
  }
}

startServer();
