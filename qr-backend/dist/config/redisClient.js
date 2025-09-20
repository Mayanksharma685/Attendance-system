"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
async function connectRedis() {
    exports.redis = (0, redis_1.createClient)({
        url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    exports.redis.on("error", (err) => {
        console.error("Redis Client Error", err);
    });
    await exports.redis.connect();
    console.log("Connected to Redis");
}
//# sourceMappingURL=redisClient.js.map