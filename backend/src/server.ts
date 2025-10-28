import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env, validateEnv } from './config/env';
import { connectDatabase } from './config/database';
import routes from './routes';
import authService from './services/auth.service';

// Create Express app
const app: Application = express();

/**
 * Security Middleware
 */
// Helmet - secure HTTP headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * General Middleware
 */
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Routes
 */
// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Credit Jambo Admin API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Error handling middleware
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Initialize server
 */
const startServer = async () => {
  try {
    console.log('🔧 Starting Credit Jambo Admin API...');

    // Validate environment variables
    validateEnv();

    // Connect to database
    await connectDatabase();

    // Create default admin if doesn't exist
    const defaultAdmin = await authService.createDefaultAdmin(
      env.ADMIN_EMAIL,
      env.ADMIN_PASSWORD,
      'System Administrator'
    );

    if (defaultAdmin) {
      console.log('👤 Default admin created successfully');
      console.log(`   Email: ${env.ADMIN_EMAIL}`);
      console.log(`   Password: ${env.ADMIN_PASSWORD}`);
      console.log('   ⚠️  Please change the password after first login!');
    }

    // Start listening
    app.listen(env.PORT, () => {
      console.log('');
      console.log('✅ Server started successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Server: http://localhost:${env.PORT}`);
      console.log(`❤️  Health: http://localhost:${env.PORT}/api/health`);
      console.log(`🔐 Auth: http://localhost:${env.PORT}/api/auth/login`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('🔴 Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();

export default app;
