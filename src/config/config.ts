import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  // API Configuration
  api: {
    baseUrl: string;
    key: string;
    timeout: number;
  };
  
  // Node Configuration
  node: {
    env: 'development' | 'production' | 'test';
    port: number;
  };
  
  // Logging
  logging: {
    level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
  };
  
  // CORS
  cors: {
    origin: string | string[];
  };
  
  // Rate Limiting
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

// Validate required environment variables
const requiredEnvVars = ['API_BASE_URL', 'API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Parse and export configuration
export const config: Config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    key: process.env.API_KEY || '',
    timeout: parseInt(process.env.API_TIMEOUT_MS || '10000', 10),
  },
  
  node: {
    env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  
  logging: {
    level: (process.env.LOG_LEVEL as any) || 'info',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || '*',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};
