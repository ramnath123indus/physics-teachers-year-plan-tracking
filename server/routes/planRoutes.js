import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import YearPlan from '../models/YearPlan.js';

const router = express.Router();

// Configure Multer storage
const upload = multer({ dest: 'uploads/' });

// 1. GET route to fetch all pre-uploaded plans (Crucial for frontend auto-matching across blocks)
router.get('/', async (req, res) => {
  try {
    const plans = await YearPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST route to handle Excel year plan uploads with parsing (Teacher-wise, Block-wise & Grade-wise)
router.post('/upload-excel', upload.single('excelFile'), async (req, res) => {
  try {
    const { teacherName, blockName, subject, grade } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read and parse the uploaded Excel file using 'xlsx'
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map Excel rows to match your schema's 'excelData' format
    const formattedExcelData = sheetData.map((row, index) => ({
      rowId: index + 1,
      term: row.Term || row.term || 'Term 1',
      month: row.Month || row.month || 'General',
      topic: row.Topic || row.topic || row.Syllabus || row['NCERT SYLLABUS'] || 'Untitled Topic',
      status: 'Pending'
    }));

    // Save or update the record in MongoDB matching criteria uniquely
    const updatedPlan = await YearPlan.findOneAndUpdate(
      { teacherName: teacherName || 'Master Plan', blockName, subject, grade }, 
      {
        teacherName: teacherName || 'Master Plan',
        blockName,
        subject,
        grades: [grade], 
        excelData: formattedExcelData,
        fileName: file.originalname
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Excel file successfully parsed and saved for Block: ${blockName}, Subject: ${subject}, Grade: ${grade}`);

    res.status(200).json({ 
      message: 'Excel file successfully parsed and pre-uploaded!', 
      plan: updatedPlan 
    });
  } catch (error) {
    console.error('Excel Parsing & Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;