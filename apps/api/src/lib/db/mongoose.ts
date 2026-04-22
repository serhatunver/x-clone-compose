import mongoose from 'mongoose';
import { config } from '#/config/config.js';
import { logger } from '#/lib/utils/logger.js';

const { STATES } = mongoose;

mongoose.set('transactionAsyncLocalStorage', true);

if (config.app.isDevelopment) {
  mongoose.set('debug', true);
}

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === STATES.connected;
};

export const getDbStatus = (): string => {
  return STATES[mongoose.connection.readyState] || 'unknown';
};

export const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== STATES.disconnected) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed.');
  }
};

export const connect = async () => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB: Connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB Connection Error: ${err instanceof Error ? err.message : err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB: Disconnected. Reconnecting...');
  });

  try {
    await mongoose.connect(config.database.mongodb.uri);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`Failed to connect to MongoDB on startup: ${errorMessage}`);
    process.exit(1);
  }
};

export const db = { connect, disconnect, getDbStatus, isConnected };
