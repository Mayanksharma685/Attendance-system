import { useState, useRef, useEffect } from "react";
import { generateQR } from "../services/api";

export function useQR() {
  const [qrImage, setQrImage] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const countdownRef = useRef(null);
  const qrIntervalRef = useRef(null);

  const fetchQR = async () => {
    try {
      const data = await generateQR();
      setQrImage(data.qrImage);
      setSuccess("QR Ready");
      setError("");
    } catch (err) {
      setError(" Could not load QR! " + err.message);
      setSuccess("");
    }
  };

  const startQR = () => {
    stopQR();
    setCountdown(30);
    fetchQR();
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopQR("⏱ QR expired!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    qrIntervalRef.current = setInterval(fetchQR, 5000);
  };

  const stopQR = (message) => {
    clearInterval(countdownRef.current);
    clearInterval(qrIntervalRef.current);
    countdownRef.current = null;
    qrIntervalRef.current = null;
    setQrImage("");
    if (message) {
      setError(message);
      setSuccess("");
    }
  };

  useEffect(() => () => { stopQR(); }, []);
  return { qrImage, countdown, error, success, startQR, stopQR };
}