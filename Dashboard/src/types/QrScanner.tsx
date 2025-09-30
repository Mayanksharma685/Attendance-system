// src/types/QrScanner.tsx
import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export interface QrScannerProps {
  onDecode?: (result: string | null) => void;
  onError?: (error: Error) => void;
  constraints?: MediaStreamConstraints;
}

const QrScanner: React.FC<QrScannerProps> = ({
  onDecode,
  onError,
  constraints,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints || { video: { facingMode: "environment" } }
        );
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        scanLoop(); // start scanning loop
      } catch (err) {
        console.error("Camera access error:", err);
        onError?.(err as Error);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };

  const scanLoop = () => {
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        onDecode?.(code.data);
      }
    }, 300); // scan every 300ms

    return () => clearInterval(interval);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
      {/* Video feed */}
      <video ref={videoRef} className="w-full max-w-md rounded-lg border" />

      {/* Hidden canvas for scanning */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QrScanner;
