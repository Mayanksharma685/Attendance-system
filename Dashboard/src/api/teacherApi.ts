// src/api/teacherApi.ts
import { apiClient } from "./config";

export const teacherApi = {
  // Generate QR for a subject
  async generateQr(subjectCode: string) {
    const res = await apiClient.get("/qr/generate-qr", {
      params: { subjectCode }, // backend expects subjectCode as query param
    });
    return res.data; // e.g. { qrId, qrData, expiresAt }
  },

  // Verify QR scan (students use this to mark attendance)
  async verifyQr(payload: string) {
    const res = await apiClient.post("/qr/verify-qr", { payload });
    return res.data; // e.g. { success: true, studentId, timestamp }
  },
};
