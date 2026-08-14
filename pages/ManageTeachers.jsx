import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Editing state
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editFormData, setEditFormData] = useState({ teacherName: '', assignments: [] });

  const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  }, []);

  // Delete Teacher
  const handleDelete = async (teacher) => {
    const tId = teacher._id || teacher.id;
    
    // 🔍 DEBUG LOG: Check your browser F12 Console when you click Delete
    console.log("Deleting teacher object:", teacher);
    console.log("Extracted ID (tId):", tId);
    console.log("Request URL:", `${apiHost}/api/teachers/${tId}`);

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

  // Start Editing
  const handleEditClick = (teacher) => {
    setEditingTeacherId(teacher._id || teacher.id);
    setEditFormData({
      teacherName: teacher.teacherName || '',
      assignments: teacher.assignments ? JSON.parse(JSON.stringify(teacher.assignments)) : []
    });
    setMessage('');
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingTeacherId(null);
    setEditFormData({ teacherName: '', assignments: [] });
  };

  // Handle Input Change inside Edit Form
  const handleNameChange = (e) => {
    setEditFormData({ ...editFormData, teacherName: e.target.value });
  };

  // Update Assignment field
  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...editFormData.assignments];
    updatedAssignments[index][field] = value;
    setEditFormData({ ...editFormData, assignments: updatedAssignments });
  };

  // Save Edited Teacher
  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`${apiHost}/api/teachers/${id}`, editFormData);
      setMessage('✅ Teacher details updated successfully!');
      setEditingTeacherId(null);
      fetchTeachers();
    } catch (err) {
      console.error('Error updating teacher:', err);
      setMessage('❌ Failed to update teacher details.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>📋 Manage Registered Teachers</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>View, edit, or delete existing teacher registrations and their assignments.</p>

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editFormData.teacherName} 
                      onChange={handleNameChange}
                      style={{ padding: '6px 10px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <h3 style={{ margin: 0, color: '#2d3436' }}>👤 {teacher.teacherName}</h3>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {isEditing ? (
                    <>
                      <button onClick={() => handleSaveEdit(tId)} style={{ background: '#00b894', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        💾 Save
                      </button>
                      <button onClick={handleCancelEdit} style={{ background: '#636e72', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(teacher)} style={{ background: '#0984e3', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(teacher)} style={{ background: '#d63031', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Assignments Section */}
              <h4 style={{ margin: '0 0 10px 0', color: '#636e72', fontSize: '0.95rem' }}>Assigned Blocks, Subjects & Grades:</h4>
              
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {editFormData.assignments.map((assign, idx) => (
                    <div key={idx} style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #eee', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <strong>Block:</strong> 
                        <input 
                          type="text" 
                          value={assign.blockName || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'blockName', e.target.value)}
                          style={{ marginLeft: '5px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div>
                        <strong>Subject:</strong> 
                        <input 
                          type="text" 
                          value={assign.subject || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'subject', e.target.value)}
                          style={{ marginLeft: '5px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div>
                        <strong>Grades (comma separated):</strong> 
                        <input 
                          type="text" 
                          value={Array.isArray(assign.grades) ? assign.grades.join(', ') : assign.grades || ''} 
                          onChange={(e) => handleAssignmentChange(idx, 'grades', e.target.value.split(',').map(g => g.trim()))}
                          style={{ marginLeft: '5px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {teacher.assignments && teacher.assignments.length > 0 ? (
                    teacher.assignments.map((assign, idx) => (
                      <div key={idx} style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.9rem', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span><strong>Block:</strong> {assign.blockName}</span>
                        <span><strong>Subject:</strong> {assign.subject}</span>
                        <span><strong>Grades:</strong> {Array.isArray(assign.grades) ? assign.grades.join(', ') : assign.grades}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#999', fontSize: '0.9rem' }}>No assignments mapped.</p>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}