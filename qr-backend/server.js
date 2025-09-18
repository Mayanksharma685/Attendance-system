import express from "express";
import cors from "cors";
import qrRoutes from "./routes/qrRoutes.js";
import { connectRedis } from "./config/redisClient.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));

// Test route (for checking if backend is alive)
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// QR routes
app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;

connectRedis()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Redis connection failed:", err.message);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
