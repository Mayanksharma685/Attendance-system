// src/services/api.js

// Backend URL from Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Function to generate QR
export async function fetchQR() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr/generate-qr`);
    if (!response.ok) {
      throw new Error(`Failed to fetch QR: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("API error (fetchQR):", err);
    return null; // return null so frontend can handle it gracefully
  }
}

// Function to verify QR (optional, if your backend supports it)
export async function verifyQR(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr/verify-qr/${sessionId}`);
    if (!response.ok) {
      throw new Error(`Failed to verify QR: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("API error (verifyQR):", err);
    return null;
  }
}
