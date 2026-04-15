// ─────────────────────────────────────────────────────────────────────────────
// Central Configuration — change URLs here, they will apply everywhere.
// ─────────────────────────────────────────────────────────────────────────────

// Backend API base URL (Flask server)
// In production (Vercel), we use the environment variable set in the dashboard.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Frontend base URL (automatic detection for dev or prod)
export const APP_BASE_URL = window.location.origin;

// Customer display URL — derived from the frontend base
export const CUSTOMER_DISPLAY_URL = `${APP_BASE_URL}/?customer-display=true`;
