// Full student profile
export interface StudentProfile {
  id: string
  name: string
  enrollment: string
  email: string
  college: string
  course: string
  tenure: string
  specialization: string
  currentSemester: number
  year: number
  fatherName: string
  motherName: string
  address: string
  contactNumber: string
}

// Attendance record for a student
export interface StudentAttendance {
  subjectCode: string
  subjectName: string
  totalClasses: number
  attendedClasses: number
  percentage: number
}

// Timetable entry
export interface TimetableEntry {
  day: string            // e.g., "Monday"
  time: string           // e.g., "10:00 - 11:00"
  subjectCode: string
  subjectName: string
  room: string
  faculty: string
}

// Result / Grade
export interface StudentResult {
  semester: number
  gpa: number
  subjects: {
    subjectCode: string
    subjectName: string
    grade: string
    credits: number
  }[]
}
