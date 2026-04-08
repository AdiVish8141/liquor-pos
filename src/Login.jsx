import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Allow any username and password to get through
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Main Card */}
      <div style={styles.card}>
        
        {/* Logo */}
        <div style={styles.logoContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Simple Wine Glass on the Left */}
            <path d="M5 19h4" />
            <path d="M7 11v8" />
            <path d="M3 3l4 8 4-8Z" />
            {/* Bottle on the Right */}
            <rect x="12" y="9" width="8" height="10" rx="2" />
            <path d="M14 2v4a2 2 0 0 0-2 2v1" />
            <path d="M20 9a2 2 0 0 0-2-2V6V2" />
            <path d="M14 2h6" />
          </svg>
        </div>

        {/* Headings */}
        <h2 style={styles.title}>Staff Login</h2>
        <p style={styles.subtitle}>Please sign in to access the system.</p>

        {/* Form Elements */}
        <form style={styles.form} onSubmit={handleSubmit}>
          
          {/* Username Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username or Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter your username or email"
                style={styles.input}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                placeholder="Enter your password"
                style={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <svg style={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={styles.forgotPasswordContainer}>
            <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.loginButton}>Login</button>
        </form>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        © 2024 Liquor POS. All Rights Reserved.
      </div>

    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f8fa', // Off-white/gray background
    width: '100%',
    height: '100vh',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '400px',
    padding: '48px 40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#e0f2fe', // Soft blue matching styling
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '32px',
    fontWeight: '400',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '0 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#334155',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputIcon: {
    position: 'absolute',
    right: '16px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  forgotPasswordContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
    marginTop: '-8px',
  },
  forgotPassword: {
    fontSize: '12px',
    color: '#0ea5e9',
    textDecoration: 'none',
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: '44px',
    backgroundColor: '#0ea5e9', // primary blue
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '32px',
    fontSize: '12px',
    color: '#94a3b8',
  }
};
