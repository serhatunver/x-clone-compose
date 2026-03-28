import mongoose from 'mongoose';
import { config } from '#/config/config.js';

const { STATES } = mongoose;

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === STATES.connected;
};

export const getDbStatus = (): string => {
  return STATES[mongoose.connection.readyState] || 'unknown';
};

export const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== STATES.disconnected) {
    await mongoose.disconnect();
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
