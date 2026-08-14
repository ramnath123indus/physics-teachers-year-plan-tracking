import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewTeacherPlan() {
  const [viewOptions, setViewOptions] = useState({ blocks: [], subjects: [], grades: [] });
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [yearPlan, setYearPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch dropdown options on load
  useEffect(() => {
    axios.get('http://localhost:5000/api/master-plans/view-options')
      .then(res => {
        setViewOptions(res.data);
      })
      .catch(err => {
        console.error('Error fetching view options:', err);
        setMessage('Failed to load view options from server.');
      });
  }, []);

  // Fetch Excel plan data when user searches/submits
  const handleViewPlan = (e) => {
    e.preventDefault();
    if (!selectedBlock || !selectedSubject || !selectedGrade) {
      alert('Please select Block, Subject, and Grade.');
      return;
    }

    setLoading(true);
    setMessage('');

    axios.get(`http://localhost:5000/api/master-plans/submit?blockName=${selectedBlock}&subject=${selectedSubject}&grade=${selectedGrade}`)
      .then(res => {
        setYearPlan(res.data.yearPlan || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching plan data:', err);
        setYearPlan([]);
        setMessage('No data found or error fetching the file.');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>View Teacher Year Plans</h2>

      {/* Selection Form */}
      <form onSubmit={handleViewPlan} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Block:</label>
          <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)} style={{ padding: '0.5rem', minWidth: '150px' }}>
            <option value="">Select Block</option>
            {viewOptions.blocks.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ padding: '0.5rem', minWidth: '150px' }}>
            <option value="">Select Subject</option>
            {viewOptions.subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Grade:</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} style={{ padding: '0.5rem', minWidth: '150px' }}>
            <option value="">Select Grade</option>
            {viewOptions.grades.map((g, i) => <option key={i} value={g}>{g}</option>)}
          </select>
        </div>

        <button type="submit" style={{ padding: '0.6rem 1.5rem', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1.4rem' }}>
          View Plan
        </button>
      </form>

      {loading && <p>Loading plan data...</p>}
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {/* Excel Data Table */}
      {yearPlan.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#27ae60', color: '#white', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>#</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Month</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>NCERT Syllabus</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Assessments</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>IIT Syllabus</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-1</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-2</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-3</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-4</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-5</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Section-6</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', color: '#fff' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {yearPlan.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.month}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.ncertSyllabus}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.assessments}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.iitSyllabus}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section1}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section2}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section3}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section4}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section5}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.section6}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}