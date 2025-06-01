interface Config {
    api: {
        baseUrl: string;
        key: string;
        timeout: number;
    };
    node: {
        env: 'development' | 'production' | 'test';
        port: number;
    };
    logging: {
        level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
    };
    cors: {
        origin: string | string[];
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
}
export declare const config: Config;
export {};
