// declare module "@yudiel/react-qr-scanner" {
//   import React from "react";

//   export interface QrScannerProps {
//     onDecode?: (result: string | null) => void;
//     onError?: (error: Error) => void;
//     constraints?: MediaStreamConstraints;
//   }

//  const QrScanner: React.FC<QrScannerProps>;
//  export default QrScanner;
// }
export interface QrScannerProps {
    onDecode?: (result: string | null) => void;
    onError?: (error: Error) => void;
    constraints?: MediaStreamConstraints;
  }

 declare const QrScanner: React.FC<QrScannerProps>;
 export default QrScanner;