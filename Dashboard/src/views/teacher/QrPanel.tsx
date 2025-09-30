// src/views/teacher/QrPanel.tsx
import React, { useEffect, useState } from "react";
import { Subject, StudentAttendance } from "../../models/Teacher";
import { teacherApi } from "../../api/teacherApi";

export default function QrPanel({ selected }: { selected: Subject | null }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null); // backend sends qrData
  const [active, setActive] = useState(false);
  const [attendees, setAttendees] = useState<StudentAttendance[]>([]);

  // 🔹 Poll attendance every 2.5s
  useEffect(() => {
    let t: any;
    if (active && sessionId) {
      t = setInterval(async () => {
        try {
          const data = await teacherApi.getAttendance(sessionId);
          setAttendees(data || []);
        } catch (e) {
          console.error("Error fetching attendance:", e);
        }
      }, 2500);
    }
    return () => clearInterval(t);
  }, [active, sessionId]);

  // 🔹 Start Session
  const start = async () => {
    if (!selected) return alert("Please select a subject first");
    try {
      const res = await teacherApi.startSession(selected.code);
      setSessionId(res.sessionId);
      setQrData(res.qrData); // backend sends qrData (URL or string)
      setActive(true);
    } catch (e) {
      console.error("Error starting session:", e);
      // fallback mock
      setSessionId("mock-session");
      setQrData("MOCK-QR-DATA");
      setActive(true);
    }
  };

  // 🔹 Stop Session
  const stop = async () => {
    if (!sessionId) return;
    try {
      await teacherApi.stopSession(sessionId);
    } catch (e) {
      console.error("Error stopping session:", e);
    }
    setActive(false);
    setSessionId(null);
    setQrData(null);
    setAttendees([]);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">QR Panel</div>
          <div className="text-sm text-gray-500">
            {selected
              ? `${selected.code} - ${selected.title}`
              : "No subject selected"}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={start}
            className="px-3 py-2 bg-gray-800 text-white rounded"
            disabled={!selected || active}
          >
            Start QR
          </button>
          <button
            onClick={stop}
            className="px-3 py-2 border rounded"
            disabled={!active}
          >
            Stop QR
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="mt-6 flex gap-6">
        {/* QR Display */}
        <div className="w-96 h-96 bg-gray-50 rounded-lg flex items-center justify-center border relative">
          {active && qrData ? (
            <>
              <div className="absolute top-3 right-3 text-xs text-green-500">
                Live
              </div>
              <div className="text-center">
                {/* If backend gives image URL */}
                {qrData.startsWith("http") ? (
                  <img
                    src={qrData}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                ) : (
                  <>
                    {/* Otherwise render raw QR string */}
                    <QRCode value={qrData} size={250} />
                    <div className="font-mono text-xs mt-2">{qrData}</div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-400">
              QR will occupy this space (full-screen in real app)
            </div>
          )}
        </div>

        {/* Attendance List */}
        <div className="flex-1 p-4 bg-gray-50 rounded border">
          <div className="font-semibold">Live Attendance</div>
          <div className="mt-3 space-y-2">
            {attendees.length === 0 && (
              <div className="text-sm text-gray-500">No attendees yet</div>
            )}
            {attendees.map((a) => (
              <div
                key={a.studentId}
                className="p-2 rounded border flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.enrollment}</div>
                </div>
                <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                  Present
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
