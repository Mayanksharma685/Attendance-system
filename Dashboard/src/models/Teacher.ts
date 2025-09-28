// models/Teacher.ts

export interface Subject {
  code: string
  title: string
  description: string
}

export interface QrSession {
  qrId: string
  subjectCode: string
  startedAt: string   // ISO date string
}

export interface StudentAttendance {
  studentId: string
  studentName: string
  status: 'PRESENT' | 'ABSENT'
}
