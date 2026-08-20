import express from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const router = express.Router();

// Bulletproof path resolution for your excel files directory
let EXCEL_DIR = path.join(process.cwd(), 'server', 'master-excel-files');
if (!fs.existsSync(EXCEL_DIR)) {
  EXCEL_DIR = path.join(process.cwd(), 'master-excel-files');
}

// Precise file resolver matching your specific naming rules for Kailash vs General blocks (Physics & Biology)
function getExistingExcelFilePath(blockName, subject, grade) {
  const safeBlock = (blockName || '').toString().trim();
  const safeSubject = (subject || '').toString().trim().toUpperCase();
  const safeGrade = (grade || '').toString().replace(/^Grade\s*/i, '').trim();
  
  if (!fs.existsSync(EXCEL_DIR)) {
    fs.mkdirSync(EXCEL_DIR, { recursive: true });
  }

  let fileName = '';

  // Rule for Kailash block
  if (safeBlock.toUpperCase() === 'KAILASH') {
    if (safeSubject === 'PHYSICS') {
      fileName = `Kailash_PHYSICS_Grade ${safeGrade}.xlsx`;
    } else if (safeSubject === 'BIOLOGY') {
      fileName = `Kailash_BIOLOGY_Grade ${safeGrade}.xlsx`;
    } else {
      fileName = `General_${safeSubject}_Grade ${safeGrade}.xlsx`;
    }
  } else {
    // Rule for all other blocks (General, Nilgiri, Aravalli, etc.)
    if (safeSubject === 'PHYSICS') {
      fileName = `General_PHYSICS_Grade ${safeGrade}.xlsx`;
    } else if (safeSubject === 'BIOLOGY') {
      fileName = `General_BIOLOGY_Grade ${safeGrade}.xlsx`;
    } else {
      fileName = `General_${safeSubject}_Grade ${safeGrade}.xlsx`;
    }
  }

  return path.join(EXCEL_DIR, fileName);
}

// GET plan data (Dashboard)
router.get('/submit', (req, res) => {
  try {
    const { blockName, subject, grade } = req.query;
    if (!blockName || !subject || !grade) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const filePath = getExistingExcelFilePath(blockName, subject, grade);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Excel file '${path.basename(filePath)}' not found in server/master-excel-files.` });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const yearPlan = sheetData.map(row => ({
      month: row['MONTH'] || row['Month'] || '',
      ncertSyllabus: row['NCERT SYLLABUS'] || row['NCERT Syllabus'] || '',
      assessments: row['ASSESSMENTS'] || row['Assessments'] || '',
      iitSyllabus: row['IIT SYLLABUS'] || row['IIT Syllabus'] || '',
      section1: row['SECTION-1'] || row['Section-1'] || 'Not Assigned',
      section2: row['SECTION-2'] || row['Section-2'] || 'Not Assigned',
      section3: row['SECTION-3'] || row['Section-3'] || 'Not Assigned',
      section4: row['SECTION-4'] || row['Section-4'] || 'Not Assigned',
      section5: row['SECTION-5'] || row['Section-5'] || 'Not Assigned',
      section6: row['SECTION-6'] || row['Section-6'] || 'Not Assigned',
      status: row['STATUS'] || row['Status'] || 'Not Assigned'
    }));

    res.json({ yearPlan });
  } catch (err) {
    console.error('Error reading excel file:', err);
    res.status(500).json({ error: 'Failed to read excel file from server' });
  }
});

// POST Update plan data with Auto-Fit & Full Cell Visibility
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

    // --- AUTO-FIT COLUMN WIDTHS & CELL VISIBILITY ---
    const colWidths = [];
    const range = XLSX.utils.decode_range(newSheet['!ref']);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!newSheet[cellAddress]) continue;

        const cellVal = newSheet[cellAddress].v ? newSheet[cellAddress].v.toString() : '';
        const len = cellVal.length;
        if (!colWidths[C] || len > colWidths[C]) {
          colWidths[C] = len;
        }
      }
    }

    // Set generous width boundaries so cells are fully readable
    newSheet['!cols'] = colWidths.map(w => ({ wch: Math.max((w || 10) + 5, 22) }));
    // ----------------------------------------------

    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'YearPlan');
    
    XLSX.writeFile(newWorkbook, filePath);
    res.status(200).json({ success: true, message: 'Excel file updated successfully with full cell visibility' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;