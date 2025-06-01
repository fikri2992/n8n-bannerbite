"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const env_1 = require("./env");
console.log('🔍 Checking environment variables...');
try {
    // This will throw an error if required environment variables are missing
    (0, env_1.validateEnv)();
    console.log('✅ All required environment variables are set');
    console.log('\nCurrent configuration:');
    // Log non-sensitive configuration
    console.log(`\n🌐 API Configuration:`);
    console.log(`- Base URL: ${config_1.config.api.baseUrl}`);
    console.log(`- Timeout: ${config_1.config.api.timeout}ms`);
    console.log(`\n🖥️  Node Configuration:`);
    console.log(`- Environment: ${config_1.config.node.env}`);
    console.log(`- Port: ${config_1.config.node.port}`);
    console.log(`\n📝 Logging:`);
    console.log(`- Level: ${config_1.config.logging.level}`);
    console.log(`\n🌍 CORS:`);
    console.log(`- Allowed Origins: ${Array.isArray(config_1.config.cors.origin) ? config_1.config.cors.origin.join(', ') : config_1.config.cors.origin}`);
    console.log(`\n⏱️  Rate Limiting:`);
    console.log(`- Window: ${config_1.config.rateLimit.windowMs / 60000} minutes`);
    console.log(`- Max Requests: ${config_1.config.rateLimit.max} per window`);
}
catch (error) {
    console.error('❌ Error checking environment variables:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
}
//# sourceMappingURL=check-env.js.map