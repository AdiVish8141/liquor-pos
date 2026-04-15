import { useEffect, useState } from 'react';
import './index.css';
import Login from './Login';
import Home from './Home';
import CustomerDisplay from './CustomerDisplay';
import { API_BASE_URL } from './config';

// Store session check result while animation runs
const sessionResultRef = { current: null };

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCustomerDisplay, setIsCustomerDisplay] = useState(false);

  useEffect(() => {
    // Check if we are in customer display mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('customer-display') === 'true') {
      setIsCustomerDisplay(true);
      return;
    }

    // Run session check but DON'T set isLoaded — stash result for after animation
    const checkSession = async () => {
      const token = localStorage.getItem('liquor_pos_token');
      const user = localStorage.getItem('liquor_pos_user');
      
      if (token && user) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const userData = await res.json();
            sessionResultRef.current = { loggedIn: true, user: userData };
          } else {
            localStorage.removeItem('liquor_pos_token');
            localStorage.removeItem('liquor_pos_user');
            sessionResultRef.current = { loggedIn: false };
          }
        } catch (err) {
          console.error("Session verification failed", err);
          sessionResultRef.current = { loggedIn: false };
        }
      } else {
        sessionResultRef.current = { loggedIn: false };
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isCustomerDisplay) return;
    if (isLoaded) return;
    // Simulate loading progress — isLoaded only fires when bar hits 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Apply session result AFTER animation completes
            const result = sessionResultRef.current;
            if (result?.loggedIn) {
              setIsLoggedIn(true);
              setCurrentUser(result.user);
            }
            setIsLoaded(true);
          }, 500);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 14) + 2, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoaded, isCustomerDisplay]);

  const renderContent = () => {
    if (isCustomerDisplay) {
      return <CustomerDisplay />;
    }

    if (isLoggedIn) {
      return <Home />;
    }

    if (isLoaded) {
      return <Login onLogin={(user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
      }} />;
    }

    return (
      <div style={styles.container}>
        {/* Centered Content */}
        <div style={styles.content}>
          
          {/* Logo Container */}
          <div style={styles.logoContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Base */}
              <path d="M8 22h8" />
              
              {/* Stem */}
              <path d="M12 15v7" />
              
              {/* Glass Triangle */}
              <path d="M3 4l9 11 9-11Z" />
              
              {/* Drink level line */}
              <line x1="6.3" y1="8" x2="17.7" y2="8" />
            </svg>
          </div>

          {/* Title */}
          <h1 style={styles.title}>LiquorPOS</h1>

          {/* Loading Text */}
          <p style={styles.subtitle}>Loading your workspace...</p>

          {/* Progress Bar Container */}
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBarFill, width: `${progress}%` }} className="loading-bar-animated" />
          </div>
        </div>

        {/* Version Number */}
        <div style={styles.version}>v1.0.2</div>
      </div>
    );
  };

  return (
    <div style={{ display: 'contents' }}>
      {renderContent()}

      {/* Responsive Restriction Overlay */}
      <div className="responsive-restriction-overlay">
        <div className="restriction-card">
          <div className="restriction-icon-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h2 className="restriction-title">Screen Size Not Supported</h2>
          <p className="restriction-text">
            LiquorPOS is optimized for professional desktop and tablet displays (1024px+). 
            Please use a larger screen for the best POS experience.
          </p>
          <div className="restriction-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Optimized for Desktop & iPad Landscape
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#f8fafc', // Very light background
    fontFamily: '"Inter", sans-serif',
    height: '100vh',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#e0f2fe', // Soft blue container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.1)', // Subtle shadow
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '10px',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#38bdf8', // Light blue text matching the theme
    marginBottom: '20px',
  },
  progressBarContainer: {
    width: '260px',
    height: '6px',
    backgroundColor: '#e2e8f0', // Slate 200
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0ea5e9', // Sky 500
    borderRadius: '4px',
    transition: 'width 0.3s ease-out',
  },
  version: {
    position: 'absolute',
    bottom: '24px',
    right: '32px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8', // Slate 400
  }
};
