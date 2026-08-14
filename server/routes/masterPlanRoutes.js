import express from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const router = express.Router();

// Bulletproof path resolution
let EXCEL_DIR = path.join(process.cwd(), 'server', 'master-excel-files');
if (!fs.existsSync(EXCEL_DIR)) {
  EXCEL_DIR = path.join(process.cwd(), 'master-excel-files');
}

// Helper to resolve files
function getExcelFilePath(blockName, subject, grade) {
  const safeSubject = (subject || '').toString().trim();
  const safeGrade = (grade || '').toString().replace(/^Grade\s*/i, '').trim();
  
  if (!fs.existsSync(EXCEL_DIR)) return '';

  const files = fs.readdirSync(EXCEL_DIR);

  let matchedFile = files.find(f => {
    const upperF = f.toUpperCase();
    return upperF.includes(safeSubject.toUpperCase()) && 
           upperF.includes(safeGrade) && 
           upperF.endsWith('.xlsx');
  });

  if (matchedFile) return path.join(EXCEL_DIR, matchedFile);

  const fallbackName = blockName && blockName.toUpperCase() === 'KAILASH' 
    ? `KAILASH_${safeSubject}_Grade ${safeGrade}.xlsx` 
    : `General_${safeSubject}_Grade ${safeGrade}.xlsx`;
    
  return path.join(EXCEL_DIR, fallbackName);
}

// GET plan data
router.get('/submit', (req, res) => {
  const { blockName, subject, grade } = req.query;
  const filePath = getExcelFilePath(blockName, subject, grade);

  if (!fs.existsSync(filePath)) {
    try {
      const emptyData = [{ 'MONTH': 'June', 'NCERT SYLLABUS': '', 'ASSESSMENTS': '', 'IIT SYLLABUS': '', 'SECTION-1': 'Not Assigned', 'SECTION-2': 'Not Assigned', 'SECTION-3': 'Not Assigned', 'SECTION-4': 'Not Assigned', 'SECTION-5': 'Not Assigned', 'SECTION-6': 'Not Assigned', 'STATUS': 'Not Assigned' }];
      const newWb = XLSX.utils.book_new();
      const newWs = XLSX.utils.json_to_sheet(emptyData);
      XLSX.utils.book_append_sheet(newWb, newWs, 'YearPlan');
      if (!fs.existsSync(EXCEL_DIR)) fs.mkdirSync(EXCEL_DIR, { recursive: true });
      XLSX.writeFile(newWb, filePath);
    } catch (createErr) {
      return res.status(404).json({ error: `Excel file not found` });
    }
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const yearPlan = sheetData.map(row => ({
      month: row['MONTH'] || '',
      ncertSyllabus: row['NCERT SYLLABUS'] || '',
      assessments: row['ASSESSMENTS'] || '',
      iitSyllabus: row['IIT SYLLABUS'] || '',
      section1: row['SECTION-1'] || 'Not Assigned',
      section2: row['SECTION-2'] || 'Not Assigned',
      section3: row['SECTION-3'] || 'Not Assigned',
      section4: row['SECTION-4'] || 'Not Assigned',
      section5: row['SECTION-5'] || 'Not Assigned',
      section6: row['SECTION-6'] || 'Not Assigned',
      status: row['STATUS'] || 'Not Assigned'
    }));

    res.json({ yearPlan });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read excel file' });
  }
});

// POST Update plan data back to Excel file
router.post('/update', (req, res) => {
  const { blockName, subject, grade, yearPlan } = req.body;
  const filePath = getExcelFilePath(blockName, subject, grade);

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

    // Apply data validations
    const range = XLSX.utils.decode_range(newSheet['!ref'] || 'A1:K2');
    newSheet['!data_validations'] = [];
    const targetHeaders = ['SECTION-1', 'SECTION-2', 'SECTION-3', 'SECTION-4', 'SECTION-5', 'SECTION-6', 'STATUS'];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cellVal = newSheet[cellAddress] ? newSheet[cellAddress].v : '';
      if (targetHeaders.includes(cellVal)) {
        const colLetter = XLSX.utils.encode_col(C);
        newSheet['!data_validations'].push({
          sqref: `${colLetter}2:${colLetter}${Math.max(range.e.r + 1, 50)}`,
          type: 'list',
          formula1: '"Not Assigned,In Process,Completed"',
          allowBlank: true,
          showDropDown: true
        });
      }
    }

    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'YearPlan');
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    XLSX.writeFile(newWorkbook, filePath);

    res.status(200).json({ success: true, message: 'Year plan updated successfully' });
  } catch (err) {
    console.error('Error updating excel file:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
