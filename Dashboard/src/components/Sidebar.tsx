import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const isTeacher = location.pathname.startsWith("/teacher");
  const isStudent = location.pathname.startsWith("/student");

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
            <li><Link to="/teacher/dashboard" className="block p-3 rounded-lg hover:bg-white/5">Teacher Dashboard</Link></li>
            <li><Link to="/teacher/profile" className="block p-3 rounded-lg hover:bg-white/5">Profile</Link></li>
            <li><Link to="/teacher/settings" className="block p-3 rounded-lg hover:bg-white/5">Settings</Link></li>
          </ul>
        </nav>
      )}

      {/* Student Sidebar */}
      {isStudent && (
        <nav className="flex-1">
          <ul className="space-y-2">
            <li><Link to="/student/profile" className="block p-3 rounded-lg hover:bg-white/5">Profile</Link></li>
            <li><Link to="/student/messages" className="block p-3 rounded-lg hover:bg-white/5">Messages</Link></li>
            <li><Link to="/student/attendance" className="block p-3 rounded-lg hover:bg-white/5">Attendance</Link></li>
            <li><Link to="/student/timetable" className="block p-3 rounded-lg hover:bg-white/5">Time Table</Link></li>
            <li><Link to="/student/leave" className="block p-3 rounded-lg hover:bg-white/5">Leave & Gate Outpass</Link></li>
            <li><Link to="/student/enrollment" className="block p-3 rounded-lg hover:bg-white/5">Enrollment</Link></li>
            <li><Link to="/student/hallticket" className="block p-3 rounded-lg hover:bg-white/5">Hall Ticket</Link></li>
            <li><Link to="/student/room-partner" className="block p-3 rounded-lg hover:bg-white/5">Room Partner Selection</Link></li>
            <li><Link to="/student/result" className="block p-3 rounded-lg hover:bg-white/5">Result</Link></li>
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
