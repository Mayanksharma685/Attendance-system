import type { Request, Response } from "express";
import { QRCodeService } from "../services/QRCodeService";
import * as qrServiceLegacy from "../services/QRCodeService"; 
import WebSocket, { WebSocketServer } from "ws";


// WebSocket server instance required for new QR rotation
const wsServer = new WebSocket.Server({ noServer: true });

// Create class instance with WebSocket
const qrService = new QRCodeService(wsServer);

/* -------------------------------
    Legacy Controllers (WORK WITH ROTATION)
--------------------------------- */

/**
 *  Generate QR (works with rotating token now)
 * Returns: sessionId, token, qrImage
 */
export async function generateQR(_req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, token, qrImage } = await qrServiceLegacy.generateQRCode();
    res.json({ sessionId, token, qrImage });
  } catch (err) {
    console.error("Error in generateQR:", err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
}

/**
 *  Verify QR (must match sessionId + token + must be newer than 5 seconds)
 */
export async function verifyQR(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, token } = req.body;
    if (!sessionId || !token) {
      res.status(400).json({ error: "Missing sessionId or token" });
      return;
    }

    const result = await qrServiceLegacy.verifyQRCode(sessionId, token);

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error in verifyQR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/* -------------------------------
   New Class-Based Controllers (NO PARAM CHANGES)
--------------------------------- */

/**
 *  Start rotating class QR session
 * Requires: classId
 */
export const generateQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.body; //Chqnged to classId
    if (!classId) {
      res.status(400).json({ error: "classId required" });
      return;
    }

    const session = await qrService.startSession(Number(classId)); //Ensured classId is number
    res.json(session);
  } catch (err) {
    console.error("Error in generateQr:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
};

/**
 *  Stop active QR session
 */
export const stopQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ error: "sessionId required" });
      return;
    }

    await qrService.stopSession(sessionId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error in stopQr:", err);
    res.status(500).json({ error: "Failed to stop session" });
  }
};

/**
 * Get currently active session
 */
export const getActiveSession = async (_: Request, res: Response): Promise<void> => {
  try {
    const session = qrService.getActiveSession();
    res.json(session);
  } catch (err) {
    console.error("Error in getActiveSession:", err);
    res.status(500).json({ error: "Failed to fetch active session" });
  }
};

/**
 *  Verify rotating QR scan for students
 * Requires: sessionId, token, studentId
 */
export const verifyQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, token, studentId } = req.body;

    if (!sessionId || !token || !studentId) {
      res.status(400).json({ error: "sessionId, token, and studentId required" });
      return;
    }

    const result = await qrService.verifyAttendance(sessionId, token, studentId);
    res.json(result);
  } catch (err) {
    console.error("Error in verifyQr:", err);
    res.status(400).json({ error: "Invalid QR or session expired" });
  }
};

/**
 * Export QR service instance
 */
export let qrServiceInstance: QRCodeService;
export const initQrService = (service: QRCodeService) => {
  qrServiceInstance = service;
};
