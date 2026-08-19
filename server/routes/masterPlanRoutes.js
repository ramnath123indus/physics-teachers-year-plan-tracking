import express from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const router = express.Router();

// Standard 10 months academic layout for fallback/auto-creation
const STANDARD_MONTHS = [
  'June', 'July', 'August', 'September', 'October', 
  'November', 'December', 'January', 'February', 'March'
];

// Bulletproof path resolution
let EXCEL_DIR = path.join(process.cwd(), 'server', 'master-excel-files');
if (!fs.existsSync(EXCEL_DIR)) {
  EXCEL_DIR = path.join(process.cwd(), 'master-excel-files');
}

// Helper to resolve/create files with case-insensitive check for Kailash & others
function getExcelFilePath(blockName, subject, grade) {
  const safeBlock = (blockName || '').toString().trim().toUpperCase();
  const safeSubject = (subject || '').toString().trim().toUpperCase();
  const safeGrade = (grade || '').toString().replace(/^Grade\s*/i, '').trim();
  
  if (!fs.existsSync(EXCEL_DIR)) fs.mkdirSync(EXCEL_DIR, { recursive: true });

  const files = fs.readdirSync(EXCEL_DIR);

  // Flexible search matching block name, subject, and grade regardless of casing or spacing
  let matchedFile = files.find(f => {
    const upperF = f.toUpperCase();
    return upperF.includes(safeBlock) && 
           upperF.includes(safeSubject) && 
           upperF.includes(safeGrade) && 
           upperF.endsWith('.xlsx');
  });

  if (matchedFile) return path.join(EXCEL_DIR, matchedFile);

  // Fallback filename if file doesn't exist yet
  const fallbackName = safeBlock === 'KAILASH' 
    ? `KAILASH_${subject}_Grade ${safeGrade}.xlsx` 
    : `${blockName || 'General'}_${subject}_Grade ${safeGrade}.xlsx`;
    
  return path.join(EXCEL_DIR, fallbackName);
}

// GET plan data (Dashboard)
router.get('/submit', (req, res) => {
  try {
    const { blockName, subject, grade } = req.query;
    if (!blockName || !subject || !grade) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const filePath = getExcelFilePath(blockName, subject, grade);

    // If file doesn't exist, create it with all 10 standard months template
    if (!fs.existsSync(filePath)) {
      const emptyData = STANDARD_MONTHS.map(m => ({
        'MONTH': m,
        'NCERT SYLLABUS': '',
        'ASSESSMENTS': '',
        'IIT SYLLABUS': '',
        'SECTION-1': 'Not Assigned',
        'SECTION-2': 'Not Assigned',
        'SECTION-3': 'Not Assigned',
        'SECTION-4': 'Not Assigned',
        'SECTION-5': 'Not Assigned',
        'SECTION-6': 'Not Assigned',
        'STATUS': 'Not Assigned'
      }));
      const newWb = XLSX.utils.book_new();
      const newWs = XLSX.utils.json_to_sheet(emptyData);
      XLSX.utils.book_append_sheet(newWb, newWs, 'YearPlan');
      XLSX.writeFile(newWb, filePath);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map data to match frontend requirements, ensuring all standard months are covered
    const planMap = {};
    sheetData.forEach(row => {
      const mKey = (row['MONTH'] || '').toString().trim().toUpperCase();
      if (mKey) planMap[mKey] = row;
    });

    const yearPlan = STANDARD_MONTHS.map(mName => {
      const row = planMap[mName.toUpperCase()] || {};
      return {
        month: mName,
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
      };
    });

    res.json({ yearPlan });
  } catch (err) {
    console.error('Error in /submit:', err);
    res.status(500).json({ error: 'Failed to read/create excel file' });
  }
});

// POST Update plan data
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
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'YearPlan');
    
    XLSX.writeFile(newWorkbook, filePath);
    res.status(200).json({ success: true, message: 'Plan updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;