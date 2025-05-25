const Redis = require('ioredis');
require('dotenv').config();

const shouldUseRedis =
    process.env.USE_REDIS === 'true' || process.env.NODE_ENV === 'production';

let redisClient;

if (shouldUseRedis) {
    redisClient = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    });

    redisClient.on('connect', () => {
        console.log(' Redis connected');
    });

    redisClient.on('error', (err) => {
        console.error(' Redis Error:', err);
    });
} else {
    console.log('Redis is disabled in this environment');
    // Fake client to avoid breaking the app
    redisClient = {
        get: async () => null,
        set: async () => {},
        del: async () => {},
        expire: async () => {},
    };
}

module.exports = redisClient;
