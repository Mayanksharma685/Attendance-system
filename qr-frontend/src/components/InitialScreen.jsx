import React from 'react';

const InitialScreen = ({ onStart }) => {
    return (
        <div className="initial-screen">
            <button className="start-button" onClick={onStart}>Start QR</button>
        </div>
    );
};

export default InitialScreen;