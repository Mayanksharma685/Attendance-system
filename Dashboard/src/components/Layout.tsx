import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TeacherDashboard from "../views/teacher/TeacherDashboard";
import StudentDashboard from "../views/student/StudentDashboard";

export default function Layout() {
  const loc = useLocation();

  // ✅ Detect current role from the URL
  const isTeacher = loc.pathname.startsWith("/teacher");
  const isStudent = loc.pathname.startsWith("/student");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center font-bold">
              B
            </div>
            <h1 className="text-lg font-semibold">Bennett University Dashboard</h1>
          </div>

          {/* ✅ Role Display (Not Links Anymore) */}
          <div className="flex items-center gap-4">
            {isTeacher && (
              <span className="px-3 py-1 rounded bg-gray-800 text-white">
                Teacher
              </span>
            )}
            {isStudent && (
              <span className="px-3 py-1 rounded bg-gray-800 text-white">
                Student
              </span>
            )}
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/teacher/*" element={<TeacherDashboard />} />
            <Route path="/student/*" element={<StudentDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
