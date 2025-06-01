"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = exports.validateEnv = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const config_1 = require("../config/config");
function validateEnv() {
    // Ensure required environment variables are set
    const requiredVars = ['API_BASE_URL', 'API_KEY'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    // Validate API configuration
    if (!config_1.config.api.baseUrl) {
        throw new Error('API_BASE_URL is required');
    }
    if (!config_1.config.api.key) {
        throw new Error('API_KEY is required');
    }
    // Validate URL format
    try {
        new URL(config_1.config.api.baseUrl);
    }
    catch (error) {
        throw new Error(`Invalid API_BASE_URL: ${config_1.config.api.baseUrl}`);
    }
}
exports.validateEnv = validateEnv;
function loadEnv() {
    // Load environment variables from .env file
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    // Set default NODE_ENV if not set
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }
    // Validate environment variables
    validateEnv();
}
exports.loadEnv = loadEnv;
// Load environment variables when this module is imported
loadEnv();
//# sourceMappingURL=env.js.map