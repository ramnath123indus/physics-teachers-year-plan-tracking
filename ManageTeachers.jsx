import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Edit Mode States
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editAssignments, setEditAssignments] = useState([]);

  // Dynamically uses VITE_API_URL environment variable, or falls back intelligently
  const apiHost = (
    import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://physics-teachers-year-plan-tracking-1.onrender.com')
  ).replace(/\/+$/, '');

  // Fetch registered teachers on mount
  const fetchTeachers = () => {
    setLoading(true);
    axios.get(`${apiHost}/api/teachers`)
      .then(res => {
        setTeachers(res.data.teachers || res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching teachers:', err);
        setMessage('❌ Failed to fetch teachers list.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, [apiHost]);

  // Handle Edit Initialization
  const handleStartEdit = (teacher) => {
    setEditingTeacherId(teacher._id || teacher.id);
    setEditTeacherName(teacher.teacherName || '');
    setEditAssignments(teacher.assignments ? JSON.parse(JSON.stringify(teacher.assignments)) : []);
    setMessage('');
  };

  // Handle Assignment Field Change during Edit
  const handleAssignmentChange = (index, field, value) => {
    const updated = [...editAssignments];
    if (field === 'grades') {
      // Split comma-separated string back into array
      updated[index][field] = value.split(',').map(g => g.trim()).filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setEditAssignments(updated);
  };

  // Add a blank assignment row during edit
  const handleAddAssignment = () => {
    setEditAssignments([...editAssignments, { blockName: '', subject: '', grades: [] }]);
  };

  // Remove an assignment row during edit
  const handleRemoveAssignment = (index) => {
    setEditAssignments(editAssignments.filter((_, i) => i !== index));
  };

  // Save Updated Teacher
  const handleSaveEdit = async (tId) => {
    try {
      await axios.put(`${apiHost}/api/teachers/${tId}`, {
        teacherName: editTeacherName,
        assignments: editAssignments
      });
      setMessage('✅ Teacher updated successfully!');
      setEditingTeacherId(null);
      fetchTeachers();
    } catch (err) {
      console.error('Error updating teacher:', err);
      const serverErrorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setMessage(`❌ Failed to update: ${serverErrorMsg}`);
    }
  };

  // Delete Teacher
  const handleDelete = async (teacher) => {
    const tId = teacher._id || teacher.id;
    
    if (!tId) {
      setMessage('❌ Error: Teacher ID not found.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete teacher: ${teacher.teacherName}?`)) return;

    try {
      await axios.delete(`${apiHost}/api/teachers/${tId}`);
      setMessage(`✅ Teacher ${teacher.teacherName} deleted successfully!`);
      fetchTeachers(); // Refresh list
    } catch (err) {
      console.error('Error deleting teacher:', err);
      const serverErrorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setMessage(`❌ Failed to delete: ${serverErrorMsg}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>📋 View & Manage Registered Teachers</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>View registered teacher profiles, edit their details, or manage their assigned blocks, subjects, and grades.</p>

      {message && (
        <div style={{ background: message.includes('❌') ? '#f8d7da' : '#d4edda', color: message.includes('❌') ? '#721c24' : '#155724', padding: '12px', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {loading && <p>Loading teachers...</p>}

      {!loading && teachers.length === 0 && (
        <p style={{ color: '#888', fontStyle: 'italic' }}>No registered teachers found.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {teachers.map((teacher) => {
          const tId = teacher._id || teacher.id;
          const isEditing = editingTeacherId === tId;

          return (
            <div key={tId} style={{ background: '#fff', border: '1px solid #dfe6e9', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              
              {/* Teacher Info Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editTeacherName} 
                      onChange={(e) => setEditTeacherName(e.target.value)} 
                      style={{ padding: '6px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold' }}
                    />
                  ) : (
                    <h3 style={{ margin: 0, color: '#2d3436' }}>👤 {teacher.teacherName}</h3>
                  )}
                  {teacher.email && <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.85rem' }}>📧 {teacher.email}</p>}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => handleSaveEdit(tId)} 
                        style={{ background: '#00b894', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        💾 Save
                      </button>
                      <button 
                        onClick={() => setEditingTeacherId(null)} 
                        style={{ background: '#636e72', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleStartEdit(teacher)} 
                        style={{ background: '#0984e3', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher)} 
                        style={{ background: '#d63031', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Assignments Section */}
              <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.95rem' }}>Assigned Blocks, Subjects & Grades:</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isEditing ? (
                  <div>
                    {editAssignments.map((assign, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center', background: '#f8f9fa', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}>
                        <input 
                          type="text" 
                          placeholder="Block Name" 
                          value={assign.blockName || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'blockName', e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Subject" 
                          value={assign.subject || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'subject', e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Grades (comma separated)" 
                          value={Array.isArray(assign.grades) ? assign.grades.join(', ') : assign.grades || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'grades', e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }}
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveAssignment(idx)}
                          style={{ background: '#ff7675', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={handleAddAssignment}
                      style={{ marginTop: '4px', background: '#dfe6e9', color: '#2d3436', border: '1px solid #b2bec3', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                    >
                      + Add Assignment
                    </button>
                  </div>
                ) : (
                  teacher.assignments && teacher.assignments.length > 0 ? (
                    teacher.assignments.map((assign, idx) => (
                      <div key={idx} style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.9rem', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span><strong>Block:</strong> {assign.blockName || '-'}</span>
                        <span><strong>Subject:</strong> {assign.subject || '-'}</span>
                        <span><strong>Grades:</strong> {Array.isArray(assign.grades) ? assign.grades.join(', ') : assign.grades || '-'}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#999', fontSize: '0.9rem' }}>No assignments mapped.</p>
                  )
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}