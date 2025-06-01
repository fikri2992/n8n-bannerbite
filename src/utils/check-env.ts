import { config } from '../config/config';
import { validateEnv } from './env';

console.log('🔍 Checking environment variables...');

try {
  // This will throw an error if required environment variables are missing
  validateEnv();
  
  console.log('✅ All required environment variables are set');
  console.log('\nCurrent configuration:');
  
  // Log non-sensitive configuration
  console.log(`\n🌐 API Configuration:`);
  console.log(`- Base URL: ${config.api.baseUrl}`);
  console.log(`- Timeout: ${config.api.timeout}ms`);
  
  console.log(`\n🖥️  Node Configuration:`);
  console.log(`- Environment: ${config.node.env}`);
  console.log(`- Port: ${config.node.port}`);
  
  console.log(`\n📝 Logging:`);
  console.log(`- Level: ${config.logging.level}`);
  
  console.log(`\n🌍 CORS:`);
  console.log(`- Allowed Origins: ${Array.isArray(config.cors.origin) ? config.cors.origin.join(', ') : config.cors.origin}`);
  
  console.log(`\n⏱️  Rate Limiting:`);
  console.log(`- Window: ${config.rateLimit.windowMs / 60000} minutes`);
  console.log(`- Max Requests: ${config.rateLimit.max} per window`);
  
} catch (error) {
  console.error('❌ Error checking environment variables:');
  console.error(error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}
