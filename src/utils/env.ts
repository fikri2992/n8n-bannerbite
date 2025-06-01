import * as dotenv from 'dotenv';
import * as path from 'path';
import { config } from '../config/config';

export function validateEnv() {
  // Ensure required environment variables are set
  const requiredVars = ['API_BASE_URL', 'API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate API configuration
  if (!config.api.baseUrl) {
    throw new Error('API_BASE_URL is required');
  }

  if (!config.api.key) {
    throw new Error('API_KEY is required');
  }

  // Validate URL format
  try {
    new URL(config.api.baseUrl);
  } catch (error) {
    throw new Error(`Invalid API_BASE_URL: ${config.api.baseUrl}`);
  }
}

export function loadEnv() {
  // Load environment variables from .env file
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  
  // Set default NODE_ENV if not set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  
  // Validate environment variables
  validateEnv();
}

// Load environment variables when this module is imported
loadEnv();
