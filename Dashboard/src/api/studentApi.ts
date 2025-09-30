// src/api/studentApi.ts
import axios from "axios";
import { API_BASE, QR_API_BASE } from "./config";
import {
  StudentProfile,
  StudentAttendance,
  StudentResult,
  TimetableEntry,
} from "../models/Student";

// reusable axios client for general student endpoints
const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const studentApi = {
  // ----- Student Profile -----
  async getProfile(studentId: string): Promise<StudentProfile> {
    const res = await client.get(`/student/profile/${studentId}`);
    return res.data;
  },

  // ----- Messages -----
  async getMessages(): Promise<any[]> {
    const res = await client.get("/student/messages");
    return res.data;
  },

  // ----- Attendance History -----
  async getAttendanceHistory(
    studentId: string
  ): Promise<StudentAttendance[]> {
    const res = await client.get(`/student/attendance/${studentId}`);
    return res.data;
  },

  // ----- Timetable -----
  async getTimetable(): Promise<TimetableEntry[]> {
    const res = await client.get("/student/timetable");
    return res.data;
  },

  // ----- Results -----
  async getResult(studentId: string): Promise<StudentResult> {
    const res = await client.get(`/student/result/${studentId}`);
    return res.data;
  },

  // ----- QR Attendance (real-time) -----
  async getActiveSession() {
    const res = await axios.get(`${QR_API_BASE}/active`);
    return res.data;
  },

  async verifyAttendance(
    sessionId: string,
    token: string,
    studentId: string
  ) {
    const res = await axios.post(`${QR_API_BASE}/verify`, {
      sessionId,
      token,
      studentId,
    });
    return res.data;
  },
};




