import mongoose from 'mongoose';
import dotenv from 'dotenv';
import YearPlan from './models/YearPlan.js';

dotenv.config();

const samplePlans = [
  {
    teacherName: 'Master Template',
    fileName: '6 PHYSICS.xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 6'],
    blockName: 'General',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'Basics', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'Exploring Magnets', assessments: 'Periodic Test - 1', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'Measurement of length and motion', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', ncertSyllabus: 'Measurement of length and motion', assessments: 'Periodic Test - 2', iitSyllabus: 'Measurement of area, volume and motion', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', ncertSyllabus: "Temperature and It's Measurement Part-I", assessments: 'Summative Assessment - 1', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 6, month: 'NOVEMBER', ncertSyllabus: "Temperature and It's Measurement Part-II", iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 7, month: 'DECEMBER', ncertSyllabus: 'Revision and Exam', assessments: 'Periodic Test - 3', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 8, month: 'JANUARY', ncertSyllabus: 'Beyond Earth', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 9, month: 'FEBRUARY', ncertSyllabus: 'Beyond Earth', assessments: 'Periodic Test - 4', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 10, month: 'MARCH', ncertSyllabus: 'Revision and Exams', assessments: 'Summative Assessment - 2', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '7 PHYSICS.xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 7'],
    blockName: 'General',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'Basics', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'Electricity: Circuits and their components', assessments: 'Periodic Test - 1', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'Heat transfer in Nature', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', ncertSyllabus: 'Heat transfer in Nature', assessments: 'Periodic Test - 2', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', ncertSyllabus: 'Measurement of Time and Motion', assessments: 'Summative Assessment - 1', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 6, month: 'NOVEMBER', ncertSyllabus: 'Measurement of Time and Motion', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 7, month: 'DECEMBER', ncertSyllabus: 'Light: Shadows and Reflections', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 8, month: 'JANUARY', ncertSyllabus: 'Light: Shadows and Reflections', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 9, month: 'FEBRUARY', ncertSyllabus: 'Earth, Moon, and the Sun', iitSyllabus: 'Worksheets', status: 'Not Assigned' },
      { rowId: 10, month: 'MARCH', ncertSyllabus: 'Revision and Exams', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '7 PHYSICS(KAILASH).xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 7'],
    blockName: 'Kailash',
    excelData: [
      { rowId: 1, month: 'JUNE', iitSyllabus: 'PHYSICAL WORLD', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'ELECTRICITY - CIRCUIT AND ITS COMPONENTS', assessments: 'Periodic Test - 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'EARTH, MOON AND THE SUN', iitSyllabus: 'UNITS AND MEASUREMENTS - I', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', ncertSyllabus: 'MEASUREMENT OF TIME AND MOTION', assessments: 'Periodic Test - 2', iitSyllabus: 'UNITS AND MEASUREMENTS - II, MOTION IN A STRAIGHT LINE-1', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', assessments: 'Summative Assessment - 1', iitSyllabus: 'MOTION IN A STRAIGHT LINE-1', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '8 PHYSICS.xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 8'],
    blockName: 'General',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'Recap 7th class', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'Electricity – magnetic and heating effects', assessments: 'Periodic Test - 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'Exploring Forces', iitSyllabus: 'Units and Dimensions', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', assessments: 'Periodic Test - 2', iitSyllabus: 'One dimensional motion', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', ncertSyllabus: 'Preparation for S.A- 1', assessments: 'Summative Assessment - 1', status: 'Not Assigned' },
      { rowId: 6, month: 'NOVEMBER', ncertSyllabus: 'Pressure - Winds, Storms and Cyclones', iitSyllabus: 'Laws of motion', status: 'Not Assigned' },
      { rowId: 7, month: 'DECEMBER', ncertSyllabus: 'Light : mirrors and lenses', assessments: 'Periodic Test - 3', iitSyllabus: 'Laws of motion', status: 'Not Assigned' },
      { rowId: 8, month: 'JANUARY', ncertSyllabus: 'Keeping time with the skies', iitSyllabus: 'Optics', status: 'Not Assigned' },
      { rowId: 9, month: 'FEBRUARY', assessments: 'Periodic Test - 4', iitSyllabus: 'Optics', status: 'Not Assigned' },
      { rowId: 10, month: 'MARCH', ncertSyllabus: 'Preparation for S.A- 2', assessments: 'Summative Assessment - 2', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '8 PHYSICS(KAILASH).xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 8'],
    blockName: 'Kailash',
    excelData: [
      { rowId: 1, month: 'JUNE', iitSyllabus: 'Recap of VII IIT', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'Electricity - Magnetic & Heating Effects', assessments: 'Periodic Test - 1', iitSyllabus: 'Units & Measurements – 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'Exploring Forces', iitSyllabus: 'Units and Dimensions, Measurements – 02', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', assessments: 'Periodic Test - 2', iitSyllabus: 'Motion in a Straight Line, MOTION UNDER GRAVITY', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', assessments: 'Summative Assessment - 1', iitSyllabus: 'MECHANICAL PROPERTIES OF SOLIDS', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '9 PHYSICS.xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 9'],
    blockName: 'General',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'Recap 8th class', assessments: 'Baseline test', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'DESCRIBING MOTION AROUND US', assessments: 'Periodic Test - 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', iitSyllabus: 'motion in one dimensional', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', ncertSyllabus: 'How forces affect motion', assessments: 'Periodic Test - 2', iitSyllabus: 'vectors', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', ncertSyllabus: 'Work, energy and simple machines', assessments: 'Summative Assessment - 1', status: 'Not Assigned' },
      { rowId: 6, month: 'NOVEMBER', iitSyllabus: 'motion in a plane', status: 'Not Assigned' },
      { rowId: 7, month: 'DECEMBER', ncertSyllabus: 'Sound waves : characteristics and applications', assessments: 'Periodic Test - 3', status: 'Not Assigned' },
      { rowId: 8, month: 'JANUARY', iitSyllabus: 'laws of motion', status: 'Not Assigned' },
      { rowId: 9, month: 'FEBRAUARY', ncertSyllabus: 'Jr. 10th class', iitSyllabus: 'Work, energy and power', status: 'Not Assigned' },
      { rowId: 10, month: 'MARCH', ncertSyllabus: 'light reflection and refraction', status: 'Not Assigned' },
      { rowId: 11, month: 'APRIL', ncertSyllabus: 'revision for SA- 2', assessments: 'SA- 2', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '9 PHYSICS(KAILASH).xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 9'],
    blockName: 'Kailash',
    excelData: [
      { rowId: 1, month: 'JUNE', iitSyllabus: 'Recap of 8 IIT', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'DESCRIBING MOTION AROUND US', assessments: 'Periodic Test - 1', iitSyllabus: 'MOTION IN A STRAIGHT LINE - I', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', iitSyllabus: 'MOTION IN A STRAIGHT LINE - II, Motion Under Gravity (Recap), MOTION IN A PLANE - 2D(VECTORS)', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', assessments: 'Periodic Test - 2', iitSyllabus: 'MOTION IN A PLANE - 2D (PROJECTILE MOTION)', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', assessments: 'Summative Assessment - 1', iitSyllabus: 'Circular Motion & Relative Motion in 2D', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '10 PHYSICS.xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 10'],
    blockName: 'General',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'Recap 10th class', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'Electricity', assessments: 'Periodic Test - 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'Magnetic effects of electric current', iitSyllabus: 'Electric current', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', assessments: 'Periodic Test - 2', iitSyllabus: 'Magnetic effect of electric current', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', ncertSyllabus: 'Preparation for S.A- 1', assessments: 'Summative Assessment - 1', status: 'Not Assigned' },
      { rowId: 6, month: 'NOVEMBER', iitSyllabus: 'Optics', status: 'Not Assigned' },
      { rowId: 7, month: 'DECEMBER', ncertSyllabus: 'Preparation for spell exam', iitSyllabus: 'Optics', status: 'Not Assigned' },
      { rowId: 8, month: 'JANUARY', ncertSyllabus: 'Preparation for spell exam', assessments: 'SPELLS', status: 'Not Assigned' },
      { rowId: 9, month: 'FEBRAUARY', ncertSyllabus: 'CBSE BOARD EXAMS', assessments: 'SPELLS', status: 'Not Assigned' }
    ]
  },
  {
    teacherName: 'Master Template',
    fileName: '10 PHYSICS(KAILASH).xlsx',
    subject: 'PHYSICS',
    grades: ['Grade 10'],
    blockName: 'Kailash',
    excelData: [
      { rowId: 1, month: 'JUNE', ncertSyllabus: 'HUMAN EYE AND COLOURFUL WORLD', status: 'Not Assigned' },
      { rowId: 2, month: 'JULY', ncertSyllabus: 'ELECTRICITY', assessments: 'Periodic Test - 1', status: 'Not Assigned' },
      { rowId: 3, month: 'AUGUST', ncertSyllabus: 'MAGNETIC EFFECTS OF ELECTRIC CURRENT', iitSyllabus: 'ELECTRIC CHARGES AND FIELDS', status: 'Not Assigned' },
      { rowId: 4, month: 'SEPTEMBER', assessments: 'Periodic Test - 2', iitSyllabus: 'ELECTRIC CHARGES AND FIELDS, CURRENT ELECTRICITY', status: 'Not Assigned' },
      { rowId: 5, month: 'OCTOBER', assessments: 'Summative Assessment - 1', iitSyllabus: 'CURRENT ELECTRICITY', status: 'Not Assigned' }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/teacher-year-plan');
    console.log('🟢 Connected to MongoDB for seeding...');
    
    // Automatically clear the problematic unique index if it exists
    try {
      await YearPlan.collection.dropIndex('teacherId_1');
      console.log('🗑️ Dropped old unique teacherId_1 index.');
    } catch (e) {
      console.log('ℹ️ Index teacherId_1 not present or already dropped.');
    }

    await YearPlan.deleteMany({});
    console.log('🗑️ Cleared existing master year plans.');

    await YearPlan.insertMany(samplePlans);
    console.log('🚀 Successfully seeded all Physics Year Plans with "Not Assigned" status!');
    
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();