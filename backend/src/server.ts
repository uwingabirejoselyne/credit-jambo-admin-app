import express, { Application, Request, Response } from 'express';
import { env, validateEnv } from './config/env';
import { connectDatabase } from './config/database';

// Create Express app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();

    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(env.PORT, () => {
      console.log('🚀 Server started successfully');
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Server running on: http://localhost:${env.PORT}`);
      console.log(`✅ Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
