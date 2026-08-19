import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '12px', 
      padding: '1rem 2rem', 
      background: '#2d3436', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <Link 
        to="/" 
        style={{ padding: '10px 16px', background: '#0984e3', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
      >
        📝 Year Plan
      </Link>

      <Link 
        to="/manage-teachers" 
        style={{ padding: '10px 16px', background: '#00b894', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
      >
        👩‍🏫 Manage Teachers
      </Link>

      <Link 
        to="/dashboard" 
        style={{ padding: '10px 16px', background: '#e17055', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}
      >
        📊 Dashboard
      </Link>
    </nav>
  );
}
