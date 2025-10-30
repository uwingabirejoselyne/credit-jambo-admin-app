import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-jambo-admin';

    await mongoose.connect(mongoUri);

    console.log(' MongoDB connected successfully');
    console.log(` Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Handle database connection events
 */
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed through app termination');
  process.exit(0);
});
