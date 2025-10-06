import type { Request, Response } from "express";
import { QRCodeService } from "../services/QRCodeService";
import * as qrServiceLegacy from "../services/QRCodeService"; // keep legacy exports
import WebSocket from "ws";

// New class instance (WebSocket server passed)
const wsServer = new WebSocket.Server({ noServer: true });
const qrService = new QRCodeService(wsServer);


/**
 * Generate QR (legacy Redis-based)
 * Returns sessionId + token + qrImage
 */
export async function generateQR(_req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, token, qrImage } = await qrServiceLegacy.generateQRCode(); // legacy function
    res.json({ sessionId, token, qrImage });
  } catch (err) {
    console.error("Error in generateQR:", err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
}

/**
 * Verify QR (legacy Redis-based)
 * Both sessionId + token must match
 */
export async function verifyQR(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, token } = req.body;
    if (!sessionId || !token) {
      res.status(400).json({ error: "Missing sessionId or token" });
      return;
    }

    const result = await qrServiceLegacy.verifyQRCode(sessionId, token); // legacy verifies both
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


//  Start QR session (teacher side)

export const generateQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectCode } = req.body;
    if (!subjectCode) {
      res.status(400).json({ error: "subjectCode required" });
      return;
    }

    const session = await qrService.startSession(subjectCode);
    res.json(session);
  } catch (err) {
    console.error("Error in generateQr:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
};


// Stop QR session manually

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


// Get active QR session (teacher side)
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
 * Verify student QR scan (class-based)
 * Both sessionId + token must match simultaneously
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

//  Export QR service instance for server setup
export let qrServiceInstance: QRCodeService;

export const initQrService = (service: QRCodeService) => {
  qrServiceInstance = service;
};
