import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherObj, setSelectedTeacherObj] = useState(null);
  
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  
  const [yearPlan, setYearPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch registered teachers on mount
  useEffect(() => {
    const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.get(`${apiHost}/api/teachers`)
      .then(res => {
        setTeachers(res.data.teachers || res.data || []);
      })
      .catch(err => {
        console.error('Error fetching registered teachers:', err);
      });
  }, []);

  // Automatically fetch Excel sheet when all filters are selected
  useEffect(() => {
    if (selectedTeacherObj && selectedBlock && selectedSubject && selectedGrade) {
      const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const gradeQuery = selectedGrade.replace('Grade ', '');

      setLoading(true);
      setMessage('');

      axios.get(`${apiHost}/api/master-plans/submit?blockName=${selectedBlock}&subject=${selectedSubject}&grade=${gradeQuery}`)
        .then(res => {
          setYearPlan(res.data.yearPlan || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading plan:', err);
          setYearPlan([]);
          setMessage('❌ Excel file not found or failed to load for this selection.');
          setLoading(false);
        });
    } else {
      setYearPlan([]);
    }
  }, [selectedTeacherObj, selectedBlock, selectedSubject, selectedGrade]);

  const handleTeacherChange = (e) => {
    const teacherName = e.target.value;
    const found = teachers.find(t => t.teacherName === teacherName);
    setSelectedTeacherObj(found || null);
    setSelectedBlock('');
    setSelectedSubject('');
    setSelectedGrade('');
    setYearPlan([]);
    setMessage('');
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
    setSelectedSubject('');
    setSelectedGrade('');
    setYearPlan([]);
    setMessage('');
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedGrade('');
    setYearPlan([]);
    setMessage('');
  };

  // --- ANALYTICS CALCULATIONS ---
  const totalEntries = yearPlan.length;

  const completedCount = yearPlan.filter(row => 
    row.status && row.status.trim().toUpperCase() === 'COMPLETED'
  ).length;

  const inProgressCount = yearPlan.filter(row => {
    const s = row.status ? row.status.trim().toUpperCase() : '';
    return s === 'IN PROCESS' || s === 'IN-PROGRESS' || s === 'INPROGRESS';
  }).length;

  const pendingCount = totalEntries - (completedCount + inProgressCount);

  const completedPercentage = totalEntries > 0 ? Math.round((completedCount / totalEntries) * 100) : 0;
  const inProgressPercentage = totalEntries > 0 ? Math.round((inProgressCount / totalEntries) * 100) : 0;
  const pendingPercentage = totalEntries > 0 ? Math.round((pendingCount / totalEntries) * 100) : 0;

  // Function to handle exporting current year plan to an Excel file
  const handleExportExcel = () => {
    if (!yearPlan || yearPlan.length === 0) {
      alert("No data available to export!");
      return;
    }

    const exportData = yearPlan.map(row => ({
      'MONTH': row.month || '',
      'NCERT SYLLABUS': row.ncertSyllabus || '',
      'ASSESSMENTS': row.assessments || '',
      'IIT SYLLABUS': row.iitSyllabus || '',
      'SECTION-1': row.section1 || 'Not Assigned',
      'SECTION-2': row.section2 || 'Not Assigned',
      'SECTION-3': row.section3 || 'Not Assigned',
      'SECTION-4': row.section4 || 'Not Assigned',
      'SECTION-5': row.section5 || 'Not Assigned',
      'SECTION-6': row.section6 || 'Not Assigned',
      'STATUS': row.status || 'Not Assigned'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'YearPlan');

    const fileName = `YearPlan_${selectedBlock || 'Block'}_${selectedSubject || 'Subject'}_${selectedGrade || 'Grade'}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h2>Teacher Year Plan Dashboard</h2>

      {/* Dropdown Selection Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dfe6e9' }}>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Teacher Name:</label>
          <select value={selectedTeacherObj?.teacherName || ''} onChange={handleTeacherChange} style={{ padding: '0.6rem', minWidth: '160px', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="">Select Teacher</option>
            {teachers.map((t, i) => <option key={i} value={t.teacherName}>{t.teacherName}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Block Name:</label>
          <select 
            value={selectedBlock} 
            onChange={handleBlockChange} 
            style={{ padding: '0.6rem', minWidth: '160px', borderRadius: '6px', border: '1px solid #ccc' }}
            disabled={!selectedTeacherObj}
          >
            <option value="">Select Block</option>
            {selectedTeacherObj?.assignments?.map((a, i) => <option key={i} value={a.blockName}>{a.blockName}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Subject:</label>
          <select 
            value={selectedSubject} 
            onChange={handleSubjectChange} 
            style={{ padding: '0.6rem', minWidth: '160px', borderRadius: '6px', border: '1px solid #ccc' }}
            disabled={!selectedBlock}
          >
            <option value="">Select Subject</option>
            {selectedTeacherObj?.assignments
              ?.filter(a => a.blockName === selectedBlock)
              ?.map((a, i) => <option key={i} value={a.subject}>{a.subject}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>Grades:</label>
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)} 
            style={{ padding: '0.6rem', minWidth: '160px', borderRadius: '6px', border: '1px solid #ccc' }}
            disabled={!selectedSubject}
          >
            <option value="">Select Grade</option>
            {selectedTeacherObj?.assignments
              ?.filter(a => a.blockName === selectedBlock && a.subject === selectedSubject)
              ?.[0]?.grades?.map((g, i) => <option key={i} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* 👩‍🏫 TEACHER PROFILE & WORKLOAD SUMMARY CARD */}
      {selectedTeacherObj && (
        <div style={{ background: '#e1f5fe', padding: '15px 20px', borderRadius: '8px', border: '1px solid #b3e5fc', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#0277bd' }}>👤 Teacher Profile: {selectedTeacherObj.teacherName}</h3>
            <p style={{ margin: '0 0 8px 0', color: '#01579b', fontSize: '0.9rem' }}>
              📧 <strong>Email:</strong> {selectedTeacherObj.email || 'N/A'} | 📞 <strong>Phone:</strong> {selectedTeacherObj.phone || 'N/A'}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Assigned Classes:</span>
              {selectedTeacherObj.assignments?.map((a, idx) => (
                <span key={idx} style={{ background: '#b3e5fc', color: '#01579b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                  {a.blockName} - {a.subject} ({a.grades?.join(', ')})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && <p>Loading data from Excel sheet...</p>}
      {message && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontWeight: 'bold' }}>{message}</div>}

      {/* Main Excel Plan Section with Analytics & Charts */}
      {yearPlan.length > 0 && (
        <div>
          
          {/* 📊 ANALYTICS & VISUAL CHARTS SECTION */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #dfe6e9', marginBottom: '1.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, color: '#2d3436', fontSize: '1.1rem' }}>📈 Year Plan Analytics & Progress Summary</h3>
              <button
                onClick={handleExportExcel}
                style={{ padding: '0.5rem 1.2rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                📥 Export to Excel
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#e8f5e9', padding: '12px 15px', borderRadius: '6px', borderLeft: '4px solid #2e7d32' }}>
                <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 'bold' }}>COMPLETED</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1b5e20' }}>{completedCount} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>({completedPercentage}%)</span></div>
              </div>

              <div style={{ background: '#fffde7', padding: '12px 15px', borderRadius: '6px', borderLeft: '4px solid #fbc02d' }}>
                <span style={{ fontSize: '0.85rem', color: '#f57f17', fontWeight: 'bold' }}>IN PROGRESS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>{inProgressCount} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>({inProgressPercentage}%)</span></div>
              </div>

              <div style={{ background: '#f5f5f5', padding: '12px 15px', borderRadius: '6px', borderLeft: '4px solid #757575' }}>
                <span style={{ fontSize: '0.85rem', color: '#616161', fontWeight: 'bold' }}>PENDING / OTHER</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#212121' }}>{pendingCount} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>({pendingPercentage}%)</span></div>
              </div>
            </div>

            {/* Custom Multi-Segment Progress Bar Chart */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>
                <span>Overall Completion Distribution</span>
                <span>Total Entries: {totalEntries}</span>
              </div>
              
              <div style={{ display: 'flex', height: '18px', width: '100%', background: '#e0e0e0', borderRadius: '9px', overflow: 'hidden' }}>
                <div style={{ width: `${completedPercentage}%`, background: '#2e7d32', transition: 'width 0.4s ease' }} title={`Completed: ${completedCount}`}></div>
                <div style={{ width: `${inProgressPercentage}%`, background: '#fbc02d', transition: 'width 0.4s ease' }} title={`In Progress: ${inProgressCount}`}></div>
                <div style={{ width: `${pendingPercentage}%`, background: '#b0bec5', transition: 'width 0.4s ease' }} title={`Pending: ${pendingCount}`}></div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '0.8rem', color: '#555' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#2e7d32', display: 'inline-block', borderRadius: '2px' }}></span> Completed</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#fbc02d', display: 'inline-block', borderRadius: '2px' }}></span> In Progress</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#b0bec5', display: 'inline-block', borderRadius: '2px' }}></span> Pending</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ background: '#2d3436', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Month</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>NCERT Syllabus</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Assessments</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>IIT Syllabus</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-1</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-2</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-3</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-4</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-5</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Section-6</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {yearPlan.map((row, index) => {
                  const statusVal = row.status ? row.status.trim().toUpperCase() : '';
                  const isCompleted = statusVal === 'COMPLETED';
                  const isInProgress = statusVal === 'IN PROCESS' || statusVal === 'IN-PROGRESS' || statusVal === 'INPROGRESS';
                  
                  let rowBg = 'transparent';
                  if (isCompleted) rowBg = '#f1f8e9';
                  if (isInProgress) rowBg = '#fffde7';

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd', background: rowBg }}>
                      <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                      
                      {['month', 'ncertSyllabus', 'assessments', 'iitSyllabus', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'status'].map((field) => (
                        <td key={field} style={{ padding: '8px', border: '1px solid #ddd' }}>
                          <span style={{ 
                            fontSize: '0.9rem', 
                            color: field === 'status' && isCompleted ? '#2e7d32' : field === 'status' && isInProgress ? '#f57f17' : '#2d3436', 
                            fontWeight: field === 'status' && (isCompleted || isInProgress) ? 'bold' : 'normal' 
                          }}>
                            {row[field] || '-'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}