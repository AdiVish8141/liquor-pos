import { useEffect, useState } from 'react';
import './index.css';
import Login from './Login';
import Home from './Home';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoaded) return;
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait half a second at 100% before showing login screen
          setTimeout(() => setIsLoaded(true), 500);
          return 100;
        }
        // Random increment between 2 and 15
        return Math.min(prev + Math.floor(Math.random() * 14) + 2, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (isLoggedIn) {
    return <Home />;
  }

  if (isLoaded) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
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
