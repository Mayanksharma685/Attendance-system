import React, { useState, useEffect } from 'react';
import './../styles/global.css'; // Adjust the import path as needed

const QRGenerator = () => {
    // This state will control which screen is visible
    const [showQrScreen, setShowQrScreen] = useState(false);
    
    // Other state variables for the QR code, messages, and timer
    const [qrImageSrc, setQrImageSrc] = useState('');
    const [timerMessage, setTimerMessage] = useState('Ready to start');
    const [countdown, setCountdown] = useState(30);

    // This useEffect hook handles the timers and API calls
    useEffect(() => {
        let countdownInterval = null;
        let qrInterval = null;

        if (showQrScreen) {
            // Fetch the QR code from the backend immediately
            fetchQR(); 
            
            // Start the countdown timer
            countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            // Set up an interval to refresh the QR code
            qrInterval = setInterval(fetchQR, 5000); 

        } else {
            // Clean up intervals when the QR screen is not active
            clearInterval(countdownInterval);
            clearInterval(qrInterval);
            setCountdown(30); // Reset the timer
            setQrImageSrc(''); // Clear the QR image
            setTimerMessage('Ready to start'); // Reset message
        }

        // Cleanup function for when the component unmounts
        return () => {
            clearInterval(countdownInterval);
            clearInterval(qrInterval);
        };
    }, [showQrScreen]);

    // This useEffect hook specifically handles the timer running out
    useEffect(() => {
        if (countdown <= 0 && showQrScreen) {
            setTimerMessage('⏱ QR expired!');
            setShowQrScreen(false); // Automatically switch back to the start screen
        } else if (showQrScreen) {
            setTimerMessage(`⏱ Expires in ${countdown}s`);
        }
    }, [countdown, showQrScreen]);

    // Function to fetch the QR code from your backend API
    const fetchQR = async () => {
        try {
            // The fetch URL must match your backend's API endpoint
            const res = await fetch("/api/qr/generate-qr");
            const data = await res.json();
            setQrImageSrc(data.qrImage);
        } catch (err) {
            setTimerMessage("Could not load QR!");
        }
    };

    // This function is for the 'X' close button
    const handleClose = () => {
        setShowQrScreen(false);
    };

    return (
        <>
            <div className={`initial-screen ${showQrScreen ? 'hidden' : ''}`}>
                <button className="start-button" onClick={() => setShowQrScreen(true)}>Start QR</button>
            </div>
                        <div className={`qr-screen ${showQrScreen ? 'active' : ''}`}>
                <div className="qr-content">
                    <h2>Scan QR Code</h2>
                    <div className="qr-image-wrapper">
                        {qrImageSrc && <img src={qrImageSrc} alt="QR Code" className="qr-image" />}
                        <button className="close-button" onClick={handleClose}>X</button>
                    </div>
                    <p className="status-message">{timerMessage}</p>
                </div>
            </div>
                    </>
    );
};

export default QRGenerator;