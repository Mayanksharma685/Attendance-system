import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import qrRoutes from "./routes/qrRoutes";
import { connectRedis } from "./config/redisClient";
import { WebSocketServer } from "ws";
import { QRCodeService } from "./services/QRCodeService";
import { initQrService } from "./controllers/qrController";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  })
);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is working");
});

// API Routes
app.use("/api/qr", qrRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 4000;

// Start server after Redis connection
connectRedis()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // WebSocket server (for dynamic QR updates)
    const wss = new WebSocketServer({ server });
    console.log(`WebSocket server running on ws://localhost:${PORT}`);

    // Initialize QRCodeService with WebSocket server
    const qrService = new QRCodeService(wss);
    initQrService(qrService);

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

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
});
// You could add ping/pong for WebSocket keep-alive or log connections:
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  process.exit(0);
});
