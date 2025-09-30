// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

// use "views" instead of "pages"
import TeacherDashboard from "../views/teacher/TeacherDashboard";
import StudentDashboard from "../views/student/StudentDashboard";
import Timetable from "../views/student/Timetable";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Default landing page (set teacher or student as you like) */}
        <Route index element={<Navigate to="/teacher" replace />} />

        {/* Teacher routes */}
        <Route path="teacher" element={<TeacherDashboard />} />
        <Route path="teacher/*" element={<TeacherDashboard />} />

        {/* Student routes */}
        <Route path="student/dashboard" element={<StudentDashboard />} />
        <Route path="student/timetable" element={<Timetable />} />
        <Route path="student/*" element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
}
