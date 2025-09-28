import axios from 'axios'
import { API_BASE } from './config'
import { StudentProfile, StudentAttendance, StudentResult, TimetableEntry } from '../models/Student'

// create reusable axios client
const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
})

export const studentApi = {
  async getProfile(studentId: string): Promise<StudentProfile> {
    const res = await client.get(`/student/profile/${studentId}`)
    return res.data
  },

  async getMessages(): Promise<any[]> {
    const res = await client.get('/student/messages')
    return res.data
  },

  async getAttendanceHistory(studentId: string): Promise<StudentAttendance[]> {
    const res = await client.get(`/student/attendance/${studentId}`)
    return res.data
  },

  async getTimetable(): Promise<TimetableEntry[]> {
    const res = await client.get('/student/timetable')
    return res.data
  },

  async getResult(studentId: string): Promise<StudentResult> {
    const res = await client.get(`/student/result/${studentId}`)
    return res.data
  },
}
