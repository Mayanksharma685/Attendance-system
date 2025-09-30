// src/views/student/Timetable.tsx
import React, { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import QrScanner from "../../types/QrScanner"; // adjust import path

interface Subject {
  code: string;
  title: string;
  description: string;
}

export default function Timetable() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [scanned, setScanned] = useState(false); // prevent duplicate scans

  // 🔹 Replace with logged-in studentId (later from auth/store)
  const studentId = "STU123";

  // Load student subjects (static for now, can later fetch from API)
  useEffect(() => {
    setSubjects([
      { code: "CSET301", title: "Artificial Intelligence", description: "Basics of AI" },
      { code: "CSET326", title: "Soft Computing", description: "Neural Networks and Fuzzy Logic" },
      { code: "CSET303", title: "Web Technologies", description: "Frontend and Backend Development" },
      { code: "CSET407", title: "UI Frameworks", description: "React, Angular, Vue" },
      { code: "CSET320", title: "High Performance Computing", description: "Parallel and Distributed Systems" },
      { code: "CSET322", title: "Ethics and its Dynamics", description: "Professional Ethics in IT" },
    ]);
  }, []);

  // 🔹 Fetch active session once (instead of polling)
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await studentApi.getActiveSession();
        setActiveSession(res);
      } catch {
        setActiveSession(null);
      }
    }
    fetchSession();
  }, []);

  // Handle QR scan result (auto close scanner on success)
  const handleScan = async (result: string) => {
    if (scanned) return; // ignore duplicate scans
    setScanned(true);

    try {
      const parsed = JSON.parse(result); // { sessionId, token, subjectCode }
      setLastResult({ raw: result, parsed });
      setMessage("Submitting attendance...");

      const res = await studentApi.verifyAttendance(
        parsed.sessionId,
        parsed.token,
        studentId
      );

      setAttendance((prev) => ({ ...prev, [parsed.subjectCode]: true }));
      setMessage(res?.message || "✅ Attendance marked successfully!");

      // Auto-close scanner only on success
      setTimeout(() => {
        setScanning(false);
      }, 1200);
    } catch (err: any) {
      console.error("Attendance submission failed:", err);
      setMessage(err.response?.data?.error || "❌ Failed to verify QR.");
      setScanned(false); // allow retry if failed
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📅 Student Timetable</h1>

      <div className="grid gap-4">
        {subjects.map((subject) => {
          const isActive = activeSession?.subjectCode === subject.code;

          return (
            <div
              key={subject.code}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{subject.title}</h2>
                <p className="text-sm text-gray-600">{subject.description}</p>
              </div>

              {attendance[subject.code] ? (
                <span className="text-green-600 font-medium">
                  Attendance Recorded
                </span>
              ) : isActive ? (
                <button
                  onClick={() => {
                    setScanning(true);
                    setScanned(false); // reset scan state each time scanner opens
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Record Attendance
                </button>
              ) : (
                <span className="text-gray-400">Attendance not open</span>
              )}
            </div>
          );
        })}
      </div>

      {/* QR Scanner Modal */}
      {scanning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-11/12 sm:w-2/3 md:w-1/2 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📷 Scan QR Code for {activeSession?.subjectCode}
            </h2>

            {/* Square scanner box */}
            <div className="w-[80%] aspect-square border-4 border-blue-600 rounded-xl overflow-hidden flex items-center justify-center">
              <QrScanner
                onDecode={(result: string | null) => {
                  if (result && !scanned) handleScan(result);
                }}
                onError={(error: Error) => {
                  console.error("QR Scan Error:", error);
                }}
              />
            </div>

            {/* Status message */}
            {message && (
              <p
                className={`mt-3 font-semibold text-center ${
                  message.startsWith("✅")
                    ? "text-green-600"
                    : message.startsWith("❌")
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Cancel button only */}
            <div className="mt-6">
              <button
                onClick={() => setScanning(false)}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
