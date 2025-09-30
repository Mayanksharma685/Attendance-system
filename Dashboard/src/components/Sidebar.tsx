// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const isTeacher = location.pathname.startsWith("/teacher");
  const isStudent = location.pathname.startsWith("/student");

  const linkClass = (path: string) =>
    `block p-3 rounded-lg hover:bg-white/5 ${
      location.pathname === path ? "bg-white/10 text-blue-300" : ""
    }`;

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
          B
        </div>
        <div>
          <div className="text-sm font-semibold">Bennett University</div>
          <div className="text-xs text-slate-300">Campus Dashboard</div>
        </div>
      </div>

      {/* Teacher Sidebar */}
      {isTeacher && (
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/teacher/dashboard"
                className={linkClass("/teacher/dashboard")}
              >
                Teacher Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/teacher/profile"
                className={linkClass("/teacher/profile")}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/teacher/settings"
                className={linkClass("/teacher/settings")}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Student Sidebar */}
      {isStudent && (
        <nav className="flex-1">
          <ul className="space-y-2">
            {/* ✅ Profile goes to dashboard */}
            <li>
              <Link
                to="/student/dashboard"
                className={linkClass("/student/dashboard")}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/student/messages"
                className={linkClass("/student/messages")}
              >
                Messages
              </Link>
            </li>
            <li>
              <Link
                to="/student/attendance"
                className={linkClass("/student/attendance")}
              >
                Attendance
              </Link>
            </li>

            {/* ✅ Timetable link */}
            <li>
              <Link
                to="/student/timetable"
                className={linkClass("/student/timetable")}
              >
                Time Table
              </Link>
            </li>

            <li>
              <Link
                to="/student/leave"
                className={linkClass("/student/leave")}
              >
                Leave & Gate Outpass
              </Link>
            </li>
            <li>
              <Link
                to="/student/enrollment"
                className={linkClass("/student/enrollment")}
              >
                Enrollment
              </Link>
            </li>
            <li>
              <Link
                to="/student/hallticket"
                className={linkClass("/student/hallticket")}
              >
                Hall Ticket
              </Link>
            </li>
            <li>
              <Link
                to="/student/room-partner"
                className={linkClass("/student/room-partner")}
              >
                Room Partner Selection
              </Link>
            </li>
            <li>
              <Link
                to="/student/result"
                className={linkClass("/student/result")}
              >
                Result
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Footer */}
      <div className="text-xs text-slate-400">
        ReMark: Stop Proxy Start Authenticity
      </div>
    </aside>
  );
}
