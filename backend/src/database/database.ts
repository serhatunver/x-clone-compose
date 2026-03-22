import mongoose from 'mongoose';
import { config } from '#/config/config.js';

export const DB_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === DB_STATES.CONNECTED;
};

export const getDbStatus = (): string => {
  const states: Record<number, string> = {
    [DB_STATES.CONNECTED]: 'connected',
    [DB_STATES.CONNECTING]: 'connecting',
    [DB_STATES.DISCONNECTING]: 'disconnecting',
    [DB_STATES.DISCONNECTED]: 'disconnected',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== DB_STATES.DISCONNECTED) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

export const connect = async () => {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB: Connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB Connection Error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB: Disconnected. Reconnecting...');
  });

  try {
    await mongoose.connect(config.db.mongoUri);
  } catch (err) {
    console.error('Failed to connect to MongoDB on startup:');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

export const db = { connect, disconnect, getDbStatus, isConnected };
