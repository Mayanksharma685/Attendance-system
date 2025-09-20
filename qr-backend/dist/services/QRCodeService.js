"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = generateQRCode;
exports.verifyQRCode = verifyQRCode;
const qrcode_1 = __importDefault(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const redisClient_1 = require("../config/redisClient");
async function generateQRCode() {
    try {
        // Delete any previous active QR session
        const current = await redisClient_1.redis.get("qr:current");
        if (current) {
            const { sessionId } = JSON.parse(current);
            await redisClient_1.redis.del(`qr:session:${sessionId}`);
            await redisClient_1.redis.del("qr:current");
        }
        // Create a new QR session
        const sessionId = crypto_1.default.randomUUID();
        const createdAt = Math.floor(Date.now() / 1000);
        // Store session in Redis (30s expiry)
        const sessionData = { eventId: "attend2025", createdAt };
        await redisClient_1.redis.set(`qr:session:${sessionId}`, JSON.stringify(sessionData), { EX: 30 });
        // Mark as the current QR
        await redisClient_1.redis.set("qr:current", JSON.stringify({ sessionId, createdAt }), { EX: 30 });
        // Generate QR Code image
        const qrImage = await qrcode_1.default.toDataURL(JSON.stringify({ sessionId }));
        return { qrImage, sessionId, createdAt };
    }
    catch (error) {
        console.error("Error generating QR code:", error);
        throw error;
    }
}
async function verifyQRCode(sessionId) {
    try {
        const current = await redisClient_1.redis.get("qr:current");
        if (!current) {
            return { success: false, error: "No active QR" };
        }
        const { sessionId: activeSessionId, createdAt } = JSON.parse(current);
        if (sessionId !== activeSessionId) {
            return { success: false, error: "QR already rolled out (expired)" };
        }
        const now = Math.floor(Date.now() / 1000);
        if (now - createdAt >= 30) {
            return { success: false, error: "QR expired" };
        }
        return {
            success: true,
            message: "Attendance marked successfully",
            sessionId,
            eventId: "attend2025",
        };
    }
    catch (error) {
        console.error("Error verifying QR code:", error);
        return { success: false, error: "Internal server error" };
    }
}
//# sourceMappingURL=QRCodeService.js.map