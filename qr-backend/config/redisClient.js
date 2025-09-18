import { createClient } from "redis";

const redis = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function connectRedis() {
  try {
    await redis.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
}

export { redis, connectRedis };
