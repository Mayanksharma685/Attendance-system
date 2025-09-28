import React, { useEffect, useState } from 'react'
import { StudentAttendance } from '../../models/Teacher'

export default function StudentsList(){
  const [students, setStudents] = useState<StudentAttendance[]>([])

  useEffect(()=>{
    // mock fetch
    setStudents([
      { studentId:'S001', name:'Anjali Patel', enrollment:'ENR2023001', status:'present', markedAt: new Date().toISOString() },
      { studentId:'S002', name:'Rohit Sharma', enrollment:'ENR2023002', status:'waiting' },
      { studentId:'S003', name:'Priya Singh', enrollment:'ENR2023003', status:'absent' },
    ])
  },[])

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="text-lg font-semibold mb-4">Students</div>
      <div className="grid grid-cols-2 gap-3">
        {students.map(s=>(
          <div key={s.studentId} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">{s.enrollment}</div>
            </div>
            <div className="text-xs px-2 py-1 rounded {s.status==='present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">{s.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
