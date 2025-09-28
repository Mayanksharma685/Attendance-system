// src/pages/teacher/TeacherDashboard.tsx
import { useEffect, useState } from "react";
import { teacherApi } from "../../api/teacherApi";

interface QrSession {
  sessionId: string;
  qrImage: string;
  subjectCode: string;
  startedAt: string;
  prevImage?: string; // for seamless fade transition
}

interface Subject {
  code: string;
  title: string;
  description?: string;
}

export default function TeacherDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState("");
  const [qrSession, setQrSession] = useState<QrSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // 🔹 Load subjects (fallback if backend missing)
  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await teacherApi.getSubjects?.();
        if (res) {
          const normalized = res.map((s: any) => ({
            code: s.code || s.id || "",
            title: s.title || s.name || "Untitled Subject",
            description: s.description || "",
          }));
          setSubjects(normalized);
          return;
        }
      } catch (err) {
        console.error("Error loading subjects:", err);
      }

      // fallback subjects
      setSubjects([
        { code: "CSET301", title: "Artificial Intelligence", description: "Basics of AI" },
        { code: "CSET326", title: "Soft Computing", description: "Neural Networks and Fuzzy Logic" },
        { code: "CSET303", title: "Web Technologies", description: "Frontend and Backend Development" },
        { code: "CSET407", title: "UI Frameworks", description: "React, Angular, Vue" },
        { code: "CSET320", title: "High Performance Computing", description: "Parallel and Distributed Systems" },
        { code: "CSET322", title: "Ethics and its Dynamics", description: "Professional Ethics in IT" },
      ]);
    }
    loadSubjects();
  }, []);

  // 🔹 Start QR
  const handleStartQr = async () => {
    if (!selected) return alert("Please select a subject first");
    try {
      const data = await teacherApi.generateQr(selected);
      setQrSession({
        ...data,
        subjectCode: selected,
        startedAt: new Date().toISOString(),
      });
      setTimeLeft(30);
    } catch (err) {
      console.error("Failed to start QR:", err);
    }
  };

  // 🔹 End QR
  const handleEndQr = async () => {
    try {
      await teacherApi.endQr?.();
    } catch (err) {
      console.error("Failed to end QR:", err);
    } finally {
      setQrSession(null);
      setTimeLeft(0);
    }
  };

  // 🔹 Countdown timer
  useEffect(() => {
    if (!qrSession) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleEndQr();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrSession]);

  // 🔹 Refresh QR every 5s (cross-fade, no pause)
  useEffect(() => {
    if (!qrSession) return;

    const interval = setInterval(async () => {
      try {
        const data = await teacherApi.generateQr(selected);
        const newQr = {
          ...data,
          subjectCode: selected,
          startedAt: new Date().toISOString(),
        };

        setQrSession((prev) =>
          prev ? { ...newQr, prevImage: prev.qrImage } : newQr
        );
      } catch (err) {
        console.error("Failed to refresh QR:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [qrSession, selected]);

  // 🔹 Progress circle size
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = ((30 - timeLeft) / 30) * circumference;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

      {/* Subject Selector + Start Button */}
      <div className="flex gap-3 items-center">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((sub) => (
            <option key={sub.code} value={sub.code}>
              {sub.title} – {sub.description}
            </option>
          ))}
        </select>

        {!qrSession && (
          <button
            onClick={handleStartQr}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            Start QR
          </button>
        )}
      </div>

      {/* Fullscreen QR Overlay */}
      {qrSession && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg text-center">
            {/* Close button */}
            <button
              onClick={handleEndQr}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              ✖
            </button>

            {/* Subject Code + Name */}
            <h2 className="text-lg font-semibold mb-3">
              {qrSession.subjectCode} –{" "}
              {subjects.find((s) => s.code === qrSession.subjectCode)?.title ||
                "Unknown Subject"}
            </h2>

            {/* QR Cross-Fade */}
            <div className="relative w-80 h-80 mx-auto">
              {qrSession.prevImage && (
                <img
                  src={qrSession.prevImage}
                  alt="Old QR"
                  className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500"
                />
              )}
              <img
                src={qrSession.qrImage}
                alt="QR Code"
                className="absolute inset-0 w-full h-full object-contain opacity-100 transition-opacity duration-500"
              />
            </div>

            {/* Countdown Circle */}
            <div className="relative flex justify-center items-center mt-6">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#2563eb"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute text-lg font-semibold text-gray-700">
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
