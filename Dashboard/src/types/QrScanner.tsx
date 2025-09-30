// export interface QrScannerProps {
//     onDecode?: (result: string | null) => void;
//     onError?: (error: Error) => void;
//     constraints?: MediaStreamConstraints;
//   }

// //  declare const QrScanner: React.FC<QrScannerProps>;
// //  export default QrScanner;


//  import React from 'react'
 
//  const QrScanner = ({onDecode, onError}: QrScannerProps) => {
//    return (
//      <div>
//        This is a QR Scanner
//      </div>
//    )
//  }
 
//  export default QrScanner
 

import React, { useEffect, useRef, useState } from "react";

export interface QrScannerProps {
  onDecode?: (result: string | null) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void; // Added to notify parent when scanner is closed
  constraints?: MediaStreamConstraints;
}

const QrScanner: React.FC<QrScannerProps> = ({
  onDecode,
  onError,
  onCancel,
  constraints,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start the camera
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
      } catch (err) {
        console.error("Camera access error:", err);
        onError?.(err as Error);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="w-full max-w-md rounded-lg border"
      />

      {/* Cancel button
      <button
        onClick={() => {
          stopCamera();
          onCancel?.();
        }}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
      </button> */}
    </div>
  );
};

export default QrScanner;
