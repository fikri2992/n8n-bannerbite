"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerbiteApi = void 0;
class BannerbiteApi {
    constructor() {
        this.name = 'bannerbiteApi';
        this.displayName = 'Bannerbite API Credentials';
        this.documentationUrl = 'https://bannerbite.com/docs/auth';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Authentication key from service provider',
            },
            {
                displayName: 'API Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.bannerbite.com',
                required: true,
                description: 'Base URL for the API',
            },
        ];
    }
}
exports.BannerbiteApi = BannerbiteApi;
//# sourceMappingURL=BannerbiteApi.credentials.js.map