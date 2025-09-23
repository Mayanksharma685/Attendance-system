import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import qrRoutes from "./routes/qrRoutes";
import { connectRedis } from "./config/redisClient";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: [process.env.CLIENT_URL || "http://localhost:5173"] }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is working");
});

app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 4000;

connectRedis()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Handle "port in use" error
    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please stop the other process.`);
        process.exit(1);
      } else {
        console.error("Server error:", err);
      }
    });
  })
  .catch((err: Error) => {
    console.error("Redis connection failed:", err.message);
  });

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
});
