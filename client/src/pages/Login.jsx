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
        opacity: 0.35, 
        zIndex: 0
      }} />

      {/* Outer Card Wrapper with Gradient Border Effect */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(135deg, #0984e3, #e84393, #6c5ce7)',
        padding: '3px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        boxSizing: 'border-box'
      }}>
        
        {/* Main Inner Login Card */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem 1.5rem', 
          borderRadius: '22px', 
          textAlign: 'center',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          
          {/* Header Container: Logo 1, Title, Logo 2 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '10px', 
            marginBottom: '1rem'
          }}>
            <img 
              src={logo1} 
              alt="Logo 1" 
              style={{ width: '55px', height: '55px', objectFit: 'contain', flexShrink: 0 }} 
            />
            
            <div style={{ flexGrow: 1, textAlign: 'center', overflow: 'hidden' }}>
              <h2 style={{ 
                margin: '0 0 2px 0', 
                color: '#1e272e', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                lineHeight: '1.2'
              }}>
                Montessori Indus
              </h2>
              <h2 style={{ 
                margin: 0, 
                color: '#1e272e', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                lineHeight: '1.2'
              }}>
                Residential School
              </h2>
            </div>

            <img 
              src={logo2} 
              alt="Logo 2" 
              style={{ width: '55px', height: '55px', objectFit: 'contain', flexShrink: 0 }} 
            />
          </div>

          {/* Tracker Subtitle Badge */}
          <div style={{ 
            background: '#f1f2f6', 
            color: '#3742fa', 
            fontSize: '0.75rem', 
            fontWeight: 'bold', 
            padding: '8px 12px', 
            borderRadius: '20px', 
            letterSpacing: '0.5px',
            marginBottom: '1.5rem',
            border: '1px solid #dfe4ea'
          }}>
            TEACHERS YEAR PLAN TRACKER
          </div>

          {error && (
            <div style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '1rem', 
              fontSize: '0.85rem', 
              fontWeight: 'bold', 
              textAlign: 'left' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#2f3640', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                USER NAME
              </label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  border: '1px solid #dcdde1', 
                  fontSize: '0.95rem', 
                  boxSizing: 'border-box',
                  background: '#fcfcfc',
                  outline: 'none'
                }}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#2f3640', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                PASSWORD
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  border: '1px solid #dcdde1', 
                  fontSize: '0.95rem', 
                  boxSizing: 'border-box',
                  background: '#fcfcfc',
                  outline: 'none'
                }}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: 'linear-gradient(135deg, #3742fa, #5352ed)', 
                color: '#fff', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                marginTop: '0.5rem', 
                width: '100%',
                boxSizing: 'border-box',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(55, 66, 250, 0.3)'
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}