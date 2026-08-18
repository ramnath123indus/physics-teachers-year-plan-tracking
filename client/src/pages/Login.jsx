import React, { useState } from 'react';
import axios from 'axios';
import logo1 from './logo1.png';
import logo2 from './logo2.png';
import logo3 from './logo3.png'; // Background logo

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamically uses VITE_API_URL environment variable, or falls back intelligently
  const apiHost = (
    import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://physics-teachers-year-plan-tracking-1.onrender.com')
  ).replace(/\/+$/, '');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiHost}/api/login`, { username, password });
      
      // Store token/user info in localStorage if provided by backend
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
      }

      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',    
      minHeight: '100vh', 
      width: '100vw',
      fontFamily: 'Segoe UI, sans-serif',
      overflow: 'hidden',
      background: '#f8f9fa',
      padding: '1rem',
      boxSizing: 'border-box',
      margin: 0,
      left: 0,
      top: 0
    }}>
      
      {/* Background Logo (logo3) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${logo3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4, 
        zIndex: 0
      }} />

      {/* Main Login Card */}
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.95)', 
        padding: '2.5rem 1.75rem', 
        borderRadius: '12px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
        width: '100%', 
        maxWidth: '460px', 
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        
        {/* Header Container: Logo 1 + School Name on the left, Logo 2 on the right */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '10px', 
          marginBottom: '1.5rem',
          flexWrap: 'nowrap'
        }}>
          {/* Left group: Logo 1 and School Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flexGrow: 1 }}>
            <img 
              src={logo1} 
              alt="Logo 1" 
              style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} 
            />
            
            <h2 style={{ 
              margin: 0, 
              color: '#0984e3', 
              fontSize: '0.78rem', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              textAlign: 'left',
              fontWeight: 'bold'
            }}>
              MONTESSORI INDUS RESIDENTIAL SCHOOL
            </h2>
          </div>

          {/* Right logo: Logo 2 */}
          <img 
            src={logo2} 
            alt="Logo 2" 
            style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} 
          />
        </div>

        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '1rem', 
            fontSize: '0.9rem', 
            fontWeight: 'bold', 
            textAlign: 'left' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#636e72', fontSize: '0.9rem' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#636e72', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#0984e3', 
              color: '#fff', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '6px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginTop: '0.5rem', 
              width: '100%',
              boxSizing: 'border-box',
              transition: 'background 0.2s' 
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}