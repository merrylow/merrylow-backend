const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",  // Default to local Redis
    port: process.env.REDIS_PORT || 6379,        // Default Redis port
});

redisClient.on("connect", () => {
    console.log(" Redis connected");
});

redisClient.on("error", (err) => {
    console.error(" Redis Error:", err);
});

module.exports = redisClient;
