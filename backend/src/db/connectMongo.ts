import mongoose from 'mongoose';

const connectMongo = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('connected'));
    mongoose.connection.on('open', () => console.log('open'));
    mongoose.connection.on('disconnected', () => console.log('disconnected'));
    mongoose.connection.on('reconnected', () => console.log('reconnected'));
    mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
    mongoose.connection.on('close', () => console.log('close'));

    await mongoose.connect('mongodb://mongodb:27017/twitter');
  } catch (err) {
    console.log(err);
  }
};

export default connectMongo;
