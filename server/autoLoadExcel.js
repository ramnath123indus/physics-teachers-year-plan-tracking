import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import MasterYearPlan from './models/MasterYearPlan.js';

dotenv.config();
const dbConnectionUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school-planner';

async function autoUploadExcelFiles() {
  try {
    await mongoose.connect(dbConnectionUri);
    console.log('✅ Connected to MongoDB for Auto-Excel Upload...');

    const folderPath = path.join(path.resolve(), 'master-excel-files');

    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️ Folder not found: ${folderPath}. Please create 'master-excel-files' directory inside server folder.`);
      process.exit(0);
    }

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'));

    if (files.length === 0) {
      console.log('ℹ️ No Excel files found in the folder to upload.');
      process.exit(0);
    }

    for (const file of files) {
      // Remove extension manually to be 100% safe
      const baseName = file.replace(/\.[^/.]+$/, ""); 
      const parts = baseName.split('_'); 

      if (parts.length < 3) {
        console.log(`⚠️ Skipping file '${file}': Filename must follow format 'Block_Subject_Grade.xlsx'`);
        continue;
      }

      const blockName = parts[0].trim();
      const subject = parts[1].trim();
      const grade = parts[2].trim(); // Cleanly extracts "Grade 10"

      const filePath = path.join(folderPath, file);
      const fileBuffer = fs.readFileSync(filePath);

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const yearPlan = rawData.map((row) => ({
        month: row['Month'] || row['month'] || '',
        unit: row['Unit / Chapter'] || row['Unit'] || row['unit'] || '',
        topics: row['Topics / Content'] || row['Topics'] || row['topics'] || '',
        periods: String(row['No. of Periods'] || row['Periods'] || row['periods'] || ''),
        outcomes: row['Learning Outcomes'] || row['Outcomes'] || row['outcomes'] || ''
      }));

      await MasterYearPlan.findOneAndUpdate(
        { blockName, subject, grade },
        { blockName, subject, grade, yearPlan },
        { upsert: true, returnDocument: 'after' }
      );

      console.log(`🚀 Auto-Uploaded: Block: ${blockName} | Subject: ${subject} | Grade: ${grade}`);
    }

    console.log('🎉 All Excel files automatically processed and uploaded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Auto-Upload Error:', err);
    process.exit(1);
  }
}

autoUploadExcelFiles();