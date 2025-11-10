import QRCode from "qrcode";
import crypto from "crypto";
import { redisClient } from "../config/redisClient";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

/* -------------------------------
   Legacy Interfaces + Functions
--------------------------------- */
interface QRSession {
  eventId: string;
  createdAt: number;
  tokenCreatedAt?: number;
  token?: string;
}

interface GenerateQRResponse {
  qrImage: string;
  sessionId: string;
  token: string;
  createdAt: number;
}

interface VerifyQRResponse {
  success: boolean;
  error?: string;
  message?: string;
  sessionId?: string;
  eventId?: string;
  token?: string;
}

let rotationInterval: NodeJS.Timeout | null = null;

/**
 * Rotating QR using Redis (Legacy-compatible)
 */
export async function generateQRCode(): Promise<GenerateQRResponse> {
  try {
    const current = await redisClient.get("qr:current");
    if (current) {
      const { sessionId } = JSON.parse(current) as { sessionId: string };
      await redisClient.del(`qr:session:${sessionId}`);
      await redisClient.del("qr:current");
    }

    if (rotationInterval) {
      clearInterval(rotationInterval);
      rotationInterval = null;
    }

    const sessionId = crypto.randomUUID();
    const token = crypto.randomUUID();
    const createdAt = Math.floor(Date.now() / 1000);
    const tokenCreatedAt = Date.now();

    const sessionData: QRSession = {
      eventId: "attend2025",
      createdAt,
      tokenCreatedAt,
      token,
    };

    await redisClient.set(`qr:session:${sessionId}`, JSON.stringify(sessionData), { EX: 30 });
    await redisClient.set(
      "qr:current",
      JSON.stringify({ sessionId, token, createdAt, tokenCreatedAt }),
      { EX: 30 }
    );

    const qrImage = await QRCode.toDataURL(JSON.stringify({ sessionId, token }));

    rotationInterval = setInterval(async () => {
      const newToken = uuidv4();
      const newTokenCreatedAt = Date.now();

      const updatedSession: QRSession = {
        eventId: "attend2025",
        createdAt,
        token: newToken,
        tokenCreatedAt: newTokenCreatedAt,
      };

      await redisClient.set(`qr:session:${sessionId}`, JSON.stringify(updatedSession), { EX: 30 });
      await redisClient.set(
        "qr:current",
        JSON.stringify({ sessionId, token: newToken, createdAt, tokenCreatedAt: newTokenCreatedAt }),
        { EX: 30 }
      );
    }, 5000);

    return { qrImage, sessionId, token, createdAt };
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

/**
 * Verify QR using rotating token
 */
export async function verifyQRCode(sessionId: string, token: string): Promise<VerifyQRResponse> {
  try {
    const current = await redisClient.get("qr:current");
    if (!current) {
      return { success: false, error: "No active QR" };
    }

    const { sessionId: activeSessionId, token: activeToken, createdAt, tokenCreatedAt } = JSON.parse(
      current
    ) as {
      sessionId: string;
      token: string;
      createdAt: number;
      tokenCreatedAt: number;
    };

    if (sessionId !== activeSessionId || token !== activeToken) {
      return { success: false, error: "Invalid QR or token" };
    }

    if (Date.now() - tokenCreatedAt > 5000) {
      return { success: false, error: "QR token expired" };
    }

    return {
      success: true,
      message: "Attendance marked successfully",
      sessionId,
      eventId: "attend2025",
      token,
    };
  } catch (error) {
    console.error("Error verifying QR code:", error);
    return { success: false, error: "Internal server error" };
  }
}

/* -------------------------------
   Class-Based Session Service
--------------------------------- */
interface ActiveSession {
  sessionId: string;
  classId: number;
  currentToken: string;
  qrData: string;
  expiresAt: number;
}

export class QRCodeService {
  private activeSession: ActiveSession | null = null;
  private interval: NodeJS.Timeout | null = null;


  // Start a new QR session for a class
  async startSession(classId: number): Promise<ActiveSession> {
    const sessionId = uuidv4();
    const expiresAt = Date.now() + 30_000;  // 30 seconds expiry

    const token = uuidv4();
    const qrData = await this.generateQrCode({ sessionId, token, classId });

    this.activeSession = {
      sessionId,
      classId,
      currentToken: token,
      qrData,
      expiresAt,
    };

    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(async () => {
      if (!this.activeSession) return;

      const newToken = uuidv4();
      this.activeSession.currentToken = newToken;
      this.activeSession.qrData = await this.generateQrCode({
        sessionId: this.activeSession.sessionId,
        token: newToken,
        classId: this.activeSession.classId,
      });
    }, 5000);

    setTimeout(() => this.stopSession(sessionId), 30_000);

    return this.activeSession;
  }

  async stopSession(sessionId: string) {
    if (this.activeSession?.sessionId === sessionId) {
      this.activeSession = null;
    }
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

// Get the current session (if still valid)

  getActiveSession() {
    if (!this.activeSession) return null;
    if (Date.now() > this.activeSession.expiresAt) {
      this.stopSession(this.activeSession.sessionId);
      return null;
    }
    return this.activeSession;
  }

  /**
   * Verify student scan
   * Requires both sessionId + token to match
   */

  async verifyAttendance(sessionId: string, token: string, studentId: string) {
    if (
      !this.activeSession ||
      this.activeSession.sessionId !== sessionId ||
      this.activeSession.currentToken !== token
    ) {
      throw new Error("Invalid or expired QR");
    }

    return {
      success: true,
      studentId,
      sessionId,
      timestamp: new Date(),
    };
  }

  private async generateQrCode(payload: { sessionId: string; token: string; classId: number }) {
    return await QRCode.toDataURL(JSON.stringify(payload));
  }
}
export default QRCodeService;
