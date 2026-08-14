import React, { useState } from 'react';
import Login from './pages/Login';
import TeacherRegistration from './pages/TeacherRegistration';
import ManageTeachers from './pages/ManageTeachers'; // <--- New Edit/Delete Teachers Page
import UpdateTeacherYearPlan from './pages/UpdateTeacherYearPlan';
import TeacherDashboard from './pages/TeacherDashboard';

export default function App() {
  const [user, setUser] = useState(null); // Tracks logged-in user state
  const [currentView, setCurrentView] = useState('plan'); // options: 'registration', 'manage-teachers', 'plan', 'dashboard'

  // If not logged in, render the Login Component
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Top Header / Navigation Bar */}
      <nav style={{ background: '#0984e3', padding: '15px 30px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.15)', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', marginRight: '10px' }}>📚 Teachers Year Plan Tracking</h2>
          
          {/* Navigation Options for Admin & Teacher */}
          {(user.role === 'admin' || user.role === 'teacher') && (
            <>
              <button
                onClick={() => setCurrentView('registration')}
                style={{
                  background: currentView === 'registration' ? '#d63031' : 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                👤 Teacher Registration
              </button>

              <button
                onClick={() => setCurrentView('manage-teachers')}
                style={{
                  background: currentView === 'manage-teachers' ? '#d63031' : 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                ✏️ Manage Teachers
              </button>

              <button
                onClick={() => setCurrentView('plan')}
                style={{
                  background: currentView === 'plan' ? '#e74c3c' : 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                📝 Update Year Plan
              </button>
            </>
          )}

          {/* Admin Only Navigation Option */}
          {user.role === 'admin' && (
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                background: currentView === 'dashboard' ? '#c0392b' : 'transparent',
                color: '#fff',
                border: '2px solid #fff',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              📊 Teachers Dashboard
            </button>
          )}
        </div>

        {/* User Info & Logout Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', background: '#2d3436', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
            Role: {user.role.toUpperCase()}
          </span>
          <button 
            onClick={() => setUser(null)}
            style={{ padding: '8px 16px', background: '#d63031', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Render Active View based on Login Role */}
      <main>
        {user.role === 'admin' ? (
          <>
            {currentView === 'registration' && <TeacherRegistration />}
            {currentView === 'manage-teachers' && <ManageTeachers />}
            {currentView === 'plan' && <UpdateTeacherYearPlan />}
            {currentView === 'dashboard' && <TeacherDashboard />}
          </>
        ) : (
          // Teachers have access to Registration, Manage Teachers, & Update Year Plan
          <>
            {currentView === 'registration' && <TeacherRegistration />}
            {currentView === 'manage-teachers' && <ManageTeachers />}
            {currentView === 'plan' && <UpdateTeacherYearPlan />}
          </>
        )}
      </main>
    </div>
  );
}