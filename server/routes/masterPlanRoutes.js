import express from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const router = express.Router();

// Bulletproof path resolution for your uploaded excel files directory
let EXCEL_DIR = path.join(process.cwd(), 'server', 'master-excel-files');
if (!fs.existsSync(EXCEL_DIR)) {
  EXCEL_DIR = path.join(process.cwd(), 'master-excel-files');
}

// Helper to precisely find your existing stored Excel files
function getExistingExcelFilePath(blockName, subject, grade) {
  const safeBlock = (blockName || '').toString().trim().toUpperCase();
  const safeSubject = (subject || '').toString().trim().toUpperCase();
  const safeGrade = (grade || '').toString().replace(/^Grade\s*/i, '').trim();
  
  if (!fs.existsSync(EXCEL_DIR)) {
    fs.mkdirSync(EXCEL_DIR, { recursive: true });
  }

  const files = fs.readdirSync(EXCEL_DIR);

  // Search for the file containing the block name, subject, and grade among your existing files
  let matchedFile = files.find(f => {
    const upperF = f.toUpperCase();
    return upperF.includes(safeBlock) && 
           upperF.includes(safeSubject) && 
           upperF.includes(safeGrade) && 
           upperF.endsWith('.xlsx');
  });

  if (matchedFile) {
    return path.join(EXCEL_DIR, matchedFile);
  }

  // Fallback pattern if exact match isn't found
  return path.join(EXCEL_DIR, `${blockName}_${subject}_Grade ${safeGrade}.xlsx`);
}

// GET plan data (Dashboard) - reads from your existing files
router.get('/submit', (req, res) => {
  try {
    const { blockName, subject, grade } = req.query;
    if (!blockName || !subject || !grade) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const filePath = getExistingExcelFilePath(blockName, subject, grade);

    // If the file physically doesn't exist in server/master-excel-files, return 404 
    // so it doesn't silently create dummy files for missing records.
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Excel file for block '${blockName}' and subject '${subject}' was not found in server/master-excel-files.` });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map data from your stored excel file to frontend requirements
    const yearPlan = sheetData.map(row => ({
      month: row['MONTH'] || row['Month'] || '',
      ncertSyllabus: row['NCERT SYLLABUS'] || row['NCERT Syllabus'] || '',
      assessments: row['ASSESSMENTS'] || row['Assessments'] || '',
      iitSyllabus: row['IIT SYLLABUS'] || row['IIT Syllabus'] || '',
      section1: row['SECTION-1'] || row['Section-1'] || 'Not Assigned',
      section2: row['SECTION-2'] || row['Section-2'] || 'Not Assigned',
      section3: row['SECTION-3'] || row['Section-3'] || 'Not Assigned',
      section4: row['SECTION-4'] || row['Section-4'] || 'Not Assigned',
      section5: row['SECTION-5'] || 'Not Assigned',
      section6: row['SECTION-6'] || row['Section-6'] || 'Not Assigned',
      status: row['STATUS'] || row['Status'] || 'Not Assigned'
    }));

    res.json({ yearPlan });
  } catch (err) {
    console.error('Error reading stored excel file:', err);
    res.status(500).json({ error: 'Failed to read excel file from server' });
  }
});

// POST Update plan data (Modifies your existing file)
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
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'YearPlan');
    
    XLSX.writeFile(newWorkbook, filePath);
    res.status(200).json({ success: true, message: 'Existing Excel file updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;