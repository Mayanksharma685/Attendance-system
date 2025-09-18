import * as qrService from "../services/QRCodeService.js";

// Generate a new QR Code
export async function generateQR(req, res) {
  try {
    // Service returns { sessionId, qrImage }
    const { sessionId, qrImage } = await qrService.generateQRCode();

    // Send both back to frontend
    res.json({ sessionId, qrImage });
  } catch (err) {
    console.error("Error in generateQR:", err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
}

// Verify an existing QR Code
export async function verifyQR(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const result = await qrService.verifyQRCode(sessionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("Error in verifyQR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
