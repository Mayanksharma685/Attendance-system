"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const qrRoutes_1 = __importDefault(require("./routes/qrRoutes"));
const redisClient_1 = require("./config/redisClient");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ["http://localhost:5173"] }));
app.get("/", (_req, res) => {
    res.send("Backend is working ✅");
});
app.use("/api/qr", qrRoutes_1.default);
const PORT = process.env.PORT || 3000;
(0, redisClient_1.connectRedis)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Redis connection failed:", err.message);
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ error: "Internal server error" });
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
//# sourceMappingURL=server.js.map