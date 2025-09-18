import React, { useState, useEffect, useRef } from "react";
import { fetchQR } from "../services/api"; // Your API call function
import "../styles/global.css"; // Adjust the import path as needed

export default function QRScreen() {
  const [qrImage, setQrImage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const countdownTimer = useRef(null);
  const qrRefreshTimer = useRef(null);

  // Start QR screen
  const startQR = async () => {
    setError("");
    setSuccess("");
    setActive(true);
    setTimeLeft(30);

    // Fetch QR immediately
    await loadQR();

    // Countdown
    countdownTimer.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopQR("⏱ QR expired!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Refresh QR every 5s
    qrRefreshTimer.current = setInterval(loadQR, 5000);
  };

  // Stop QR screen
  const stopQR = (message) => {
    clearInterval(countdownTimer.current);
    clearInterval(qrRefreshTimer.current);
    setQrImage("");
    setError(message || "");
    setSuccess("");
    setActive(false);
  };

  // Fetch QR from backend
  const loadQR = async () => {
    try {
      const data = await fetchQR();
      if (data?.qrImage) {
        setQrImage(data.qrImage);
        setSuccess("QR Loaded");
        setError("");
      } else {
        throw new Error("Invalid QR data");
      }
    } catch (err) {
      setError("❌ Could not load QR: " + err.message);
      setSuccess("");
    }
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      clearInterval(countdownTimer.current);
      clearInterval(qrRefreshTimer.current);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Initial Screen */}
      {!active && (
        <div className="initial-screen">
          <button className="start-button" onClick={startQR}>
            Start QR
          </button>
        </div>
      )}

      {/* QR Screen */}
      {active && (
        <div className="qr-screen active">
          <div className="qr-content">
            <h2>Scan QR Code</h2>
            <div className="qr-image-wrapper">
              {qrImage ? (
                <img src={qrImage} alt="QR Code" className="qr-image" />
              ) : (
                <p>Loading...</p>
              )}
              <button
                className="close-button"
                onClick={() => stopQR("⏱ QR closed!")}
              >
                ✕
              </button>
            </div>
            <p className="status-message">⏱ Expires in {timeLeft}s</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
