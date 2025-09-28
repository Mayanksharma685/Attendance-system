import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import TeacherDashboard from '../views/teacher/TeacherDashboard'
import StudentDashboard from '../views/student/StudentDashboard'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/teacher" replace />} />
        <Route path="teacher/*" element={<TeacherDashboard />} />
        <Route path="student/*" element={<StudentDashboard />} />
      </Route>
    </Routes>
  )
}
