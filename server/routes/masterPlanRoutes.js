// POST Update plan data with Auto-Fit Column Width
router.post('/update', (req, res) => {
  const { blockName, subject, grade, yearPlan } = req.body;
  const filePath = getExistingExcelFilePath(blockName, subject, grade);

  try {
    const sheetData = yearPlan.map(row => ({
      'MONTH': row.month,
      'NCERT SYLLABUS': row.ncertSyllabus,
      'ASSESSMENTS': row.assessments,
      'IIT SYLLABUS': row.iitSyllabus,
      'SECTION-1': row.section1 || 'Not Assigned',
      'SECTION-2': row.section2 || 'Not Assigned',
      'SECTION-3': row.section3 || 'Not Assigned',
      'SECTION-4': row.section4 || 'Not Assigned',
      'SECTION-5': row.section5 || 'Not Assigned',
      'SECTION-6': row.section6 || 'Not Assigned',
      'STATUS': row.status || 'Not Assigned'
    }));

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(sheetData);

    // --- AUTO-FIT COLUMN WIDTH LOGIC ---
    const colWidths = [];
    sheetData.forEach(row => {
      Object.keys(row).forEach((key, colIndex) => {
        const val = row[key] ? row[key].toString() : '';
        const len = Math.max(key.length, val.length);
        if (!colWidths[colIndex] || len > colWidths[colIndex]) {
          colWidths[colIndex] = len;
        }
      });
    });

    // Assign width with padding (minimum width of 12 for readability)
    newSheet['!cols'] = colWidths.map(w => ({ wch: Math.max(w + 3, 12) }));
    // -----------------------------------

    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'YearPlan');
    
    XLSX.writeFile(newWorkbook, filePath);
    res.status(200).json({ success: true, message: 'Excel file updated with auto-fit columns successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});