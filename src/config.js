// ─────────────────────────────────────────────────────────────────────────────
// Central Configuration — change URLs here, they will apply everywhere.
// ─────────────────────────────────────────────────────────────────────────────

// Backend API base URL (Flask server)
export const API_BASE_URL = 'http://localhost:5000';

// Frontend base URL (Vite / React dev server or deployed domain)
export const APP_BASE_URL = 'http://localhost:5173';

// Customer display URL — derived from the frontend base
export const CUSTOMER_DISPLAY_URL = `${APP_BASE_URL}/?customer-display=true`;
