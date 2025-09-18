// services/QRCodeService.js
import QRCode from "qrcode";
import crypto from "crypto";
import { redis } from "../config/redisClient.js";

/**
 * Generate a new QR Code (valid for 30 seconds).
 */
export async function generateQRCode() {
  try {
    //  Delete any previous active QR session
    const current = await redis.get("qr:current");
    if (current) {
      const { sessionId } = JSON.parse(current);
      await redis.del(`qr:session:${sessionId}`);
      await redis.del("qr:current");
    }

    //  Create a new QR session
    const sessionId = crypto.randomUUID();
    const createdAt = Math.floor(Date.now() / 1000);

    // Store session in Redis (30s expiry)
    await redis.set(
      `qr:session:${sessionId}`,
      JSON.stringify({ eventId: "attend2025", createdAt }),
      { EX: 30 }
    );

    // Mark as the current QR
    await redis.set(
      "qr:current",
      JSON.stringify({ sessionId, createdAt }),
      { EX: 30 }
    );

    // Generate QR Code image
    const qrImage = await QRCode.toDataURL(JSON.stringify({ sessionId }));

    // Return structured response for frontend
    return { qrImage, sessionId, createdAt };
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

/**
 * Verify a QR Code (must match the current active session).
 */
export async function verifyQRCode(sessionId) {
  try {
    // Ensure there’s an active QR
    const current = await redis.get("qr:current");
    if (!current) {
      return { success: false, error: "No active QR" };
    }

    const { sessionId: activeSessionId, createdAt } = JSON.parse(current);

    // Wrong QR (rolled out)
    if (sessionId !== activeSessionId) {
      return { success: false, error: "QR already rolled out (expired)" };
    }

    // Expired after 30 seconds
    const now = Math.floor(Date.now() / 1000);
    if (now - createdAt >= 30) {
      return { success: false, error: "QR expired" };
    }

    // Success
    return {
      success: true,
      message: "Attendance marked successfully",
      sessionId,
      eventId: "attend2025",
    };
  } catch (error) {
    console.error("Error verifying QR code:", error);
    return { success: false, error: "Internal server error" };
  }
}
