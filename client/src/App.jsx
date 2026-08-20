import React, { useState } from 'react';
import Login from './pages/Login';
import TeacherRegistration from './pages/TeacherRegistration';
import ManageTeachers from './pages/ManageTeachers';
import UpdateTeacherYearPlan from "./pages/UpdateTeacherYearPlan";
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
      {/* Top Header / Navigation Bar with Light Gray Background */}
      <nav style={{ background: '#f1f2f6', padding: '15px 30px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: '1px solid #dfe6e9' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h2 style={{ color: '#2d3436', margin: 0, fontSize: '1.2rem', marginRight: '10px' }}>📚 Teachers Year Plan Tracking</h2>
          
          {/* Navigation Options for Admin & Teacher */}
          {(user.role === 'admin' || user.role === 'teacher') && (
            <>
              {/* Teacher Registration Button - Teal / Emerald Theme */}
              <button
                onClick={() => setCurrentView('registration')}
                style={{
                  background: currentView === 'registration' ? '#00b894' : '#00cec9',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: currentView === 'registration' ? '0 0 8px rgba(0,184,148,0.6)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                👤 Teacher Registration
              </button>

              {/* Manage Teachers Button - Blue Theme */}
              <button
                onClick={() => setCurrentView('manage-teachers')}
                style={{
                  background: currentView === 'manage-teachers' ? '#0984e3' : '#74b9ff',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: currentView === 'manage-teachers' ? '0 0 8px rgba(9,132,227,0.6)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                ✏️ Manage Teachers
              </button>

              {/* Update Year Plan Button - Orange / Amber Theme */}
              <button
                onClick={() => setCurrentView('plan')}
                style={{
                  background: currentView === 'plan' ? '#e17055' : '#fab1a0',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: currentView === 'plan' ? '0 0 8px rgba(225,112,85,0.6)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                📝 Update Year Plan
              </button>
            </>
          )}

          {/* Admin Only Navigation Option - Purple Theme */}
          {user.role === 'admin' && (
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                background: currentView === 'dashboard' ? '#6c5ce7' : '#a29bfe',
                color: '#fff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: currentView === 'dashboard' ? '0 0 8px rgba(108,92,231,0.6)' : 'none',
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