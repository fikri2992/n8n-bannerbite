declare namespace NodeJS {
  interface ProcessEnv {
    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    
    // API Configuration
    API_BASE_URL: string;
    API_KEY: string;
    API_TIMEOUT_MS?: string;
    
    // Logging
    LOG_LEVEL?: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
    
    // CORS
    CORS_ORIGIN?: string;
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_MAX_REQUESTS?: string;
    
    // Add your custom environment variables here
    // CUSTOM_VARIABLE?: string;
  }
}
