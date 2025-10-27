import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration with defaults
 */
export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/credit-jambo-admin',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Admin Credentials
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@creditjambo.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123',

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

/**
 * Validate required environment variables
 */
export const validateEnv = (): void => {
  const required = ['JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && env.NODE_ENV === 'production') {
    console.warn(`⚠️  Warning: Missing required environment variables: ${missing.join(', ')}`);
  }
};
