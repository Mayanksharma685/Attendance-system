// src/api/teacherApi.ts
import { apiClient } from "./config";
import { QR_API_BASE } from "./config";

export const teacherApi = {
  // ----- Start Attendance Session -----
  async startSession(subjectCode: string) {
    const res = await apiClient.post(`${QR_API_BASE}/start`, { subjectCode });
    return res.data; // { sessionId, qrData, expiresAt }
  },


  async getSubjects() {
    const res = await apiClient.get("/teacher/subjects");
    return res.data;
  },

  async getAttendance(sessionId: string) {
  const res = await apiClient.get(`/qr/attendance/${sessionId}`);
  return res.data; // array of attendees
},

  

  // ----- Stop Attendance Session -----
  async stopSession(sessionId: string) {
    const res = await apiClient.post(`${QR_API_BASE}/stop`, { sessionId });
    return res.data; // { success: true }
  },

  // ----- Get Active Session (polling) -----
  async getActiveSession() {
    const res = await apiClient.get(`${QR_API_BASE}/active`);
    return res.data; // { subjectCode, sessionId, expiresAt }
  },

  // ----- Generate QR Manually (extra endpoint) -----
  async generateQr(subjectCode: string) {
    const res = await apiClient.get(`/qr/generate-qr`, {
      params: { subjectCode },
    });
    return res.data; // { qrId, qrData, expiresAt }
  },

  // ----- Verify QR (students use this normally, but teacher may test) -----
  async verifyQr(payload: string) {
    const res = await apiClient.post(`/qr/verify-qr`, { payload });
    return res.data; // { success, studentId, timestamp }
  },

  // ----- Get Active QRs (with mock fallback) -----
  async getActiveQrs() {
    try {
      const res = await apiClient.get(`/qr/active`);
      return res.data; // [{ subjectCode, qrId, expiresAt }]
    } catch (err) {
      console.warn("⚠️ Backend not ready, returning mock QRs");
      return [
        { subjectCode: "CSET301", qrId: "QR301", expiresAt: new Date().toISOString() },
        { subjectCode: "CSET326", qrId: "QR326", expiresAt: new Date().toISOString() },
        { subjectCode: "CSET303", qrId: "QR303", expiresAt: new Date().toISOString() },
        { subjectCode: "CSET407", qrId: "QR407", expiresAt: new Date().toISOString() },
        { subjectCode: "CSET320", qrId: "QR320", expiresAt: new Date().toISOString() },
        { subjectCode: "CSET322", qrId: "QR322", expiresAt: new Date().toISOString() },
      ];
    }
  },
};
