import { createClient, type RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  redisClient = createClient({ url: redisUrl });

  redisClient.on("error", (err: Error) => {
    console.error("Redis Client Error:", err);
  });

  await redisClient.connect();
  console.log(`Connected to Redis at ${redisUrl}`);
};

export { redisClient };
