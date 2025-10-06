import QRCode from "qrcode";
import crypto from "crypto";
import { redisClient } from "../config/redisClient";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

/* -------------------------------
   Legacy Interfaces + Functions
--------------------------------- */
interface QRSession {
  eventId: string;
  createdAt: number;
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

/**
 * Legacy: Generate QR using Redis
 */
export async function generateQRCode(): Promise<GenerateQRResponse> {
  try {
    const current = await redisClient.get("qr:current");
    if (current) {
      const { sessionId } = JSON.parse(current) as { sessionId: string };
      await redisClient.del(`qr:session:${sessionId}`);
      await redisClient.del("qr:current");
    }

    const sessionId = crypto.randomUUID();
    const token = crypto.randomUUID();
    const createdAt = Math.floor(Date.now() / 1000);

    const sessionData: QRSession = { eventId: "attend2025", createdAt };
    await redisClient.set(`qr:session:${sessionId}`, JSON.stringify(sessionData), { EX: 30 });
    await redisClient.set("qr:current", JSON.stringify({ sessionId, token, createdAt }), { EX: 30 });

    const qrImage = await QRCode.toDataURL(JSON.stringify({ sessionId, token }));

    return { qrImage, sessionId, token, createdAt };
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

/**
 * Legacy: Verify QR using Redis
 */
export async function verifyQRCode(sessionId: string, token: string): Promise<VerifyQRResponse> {
  try {
    const current = await redisClient.get("qr:current");
    if (!current) return { success: false, error: "No active QR" };

    const { sessionId: activeSessionId, token: activeToken, createdAt } = JSON.parse(current) as {
      sessionId: string;
      token: string;
      createdAt: number;
    };

    if (sessionId !== activeSessionId || token !== activeToken) {
      return { success: false, error: "Invalid QR or token" };
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - createdAt >= 30) return { success: false, error: "QR expired" };

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
   Class-Based QR Session Service
--------------------------------- */
export interface ActiveSession {
  sessionId: string;
  subjectCode: string;
  currentToken: string;
  tokenCreatedAt: number; // added timestamp for token expiry
  qrData: string;
}

export class QRCodeService {
  private activeSession: ActiveSession | null = null;
  private interval: NodeJS.Timeout | null = null;
  private wsServer: WebSocket.Server;

  constructor(wsServer: WebSocket.Server) {
    this.wsServer = wsServer;
  }

  /**
   * Start a new QR session
   */
  async startSession(subjectCode: string): Promise<ActiveSession> {
    const sessionId = uuidv4();
    const token = uuidv4();
    const tokenCreatedAt = Date.now();

    const qrData = await this.generateQrCode({ sessionId, token });
    this.activeSession = { sessionId, subjectCode, currentToken: token, tokenCreatedAt, qrData };

    // Rotate token every 5 seconds
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      if (!this.activeSession) return;
      const newToken = uuidv4();
      this.activeSession.currentToken = newToken;
      this.activeSession.tokenCreatedAt = Date.now();
      this.activeSession.qrData = await this.generateQrCode({
        sessionId: this.activeSession.sessionId,
        token: newToken,
      });

      // Broadcast to WebSocket clients
      this.wsServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            sessionId: this.activeSession?.sessionId,
            qrData: this.activeSession?.qrData,
            token: this.activeSession?.currentToken,
          }));
        }
      });
    }, 5_000); // <--- 5 seconds

    return this.activeSession;
  }

  /**
   * Stop session manually
   */
  async stopSession(sessionId: string) {
    if (this.activeSession?.sessionId === sessionId) this.activeSession = null;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
  }

  /**
   * Get active session (if not expired)
   */
  getActiveSession(): ActiveSession | null {
    return this.activeSession;
  }

  /**
   * Verify student attendance
   * Token must be current and within 5 seconds
   */
  async verifyAttendance(sessionId: string, token: string, studentId: string) {
    if (!this.activeSession || this.activeSession.sessionId !== sessionId) {
      throw new Error("Invalid session");
    }

    const now = Date.now();
    if (this.activeSession.currentToken !== token || now - this.activeSession.tokenCreatedAt > 5000) {
      throw new Error("Invalid or expired QR token");
    }

    return {
      success: true,
      studentId,
      sessionId,
      token,
      message: "Attendance marked successfully",
    };
  }

  /**
   * Generate QR code data URL
   */
  private async generateQrCode(payload: { sessionId: string; token: string }) {
    return await QRCode.toDataURL(JSON.stringify(payload));
  }
}

export default QRCodeService;
