import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MasterYearPlan from './models/MasterYearPlan.js';

dotenv.config();

const dbConnectionUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school-planner';

// -------------------------------------------------------------
// 📍 ADD YOUR SUBJECT-WISE & GRADE-WISE YEAR PLANS HERE
// -------------------------------------------------------------
const masterPlansData = [
  {
    subject: 'PHYSICS',
    grade: 'Grade 6',
    yearPlan: [
      { month: 'June', unit: 'Unit 1: Matter', topics: 'States of Matter, Properties of Solids/Liquids/Gases', periods: '10', outcomes: 'Understand molecular arrangement in states of matter' },
      { month: 'July', unit: 'Unit 2: Physical Quantities', topics: 'Measurement of Length, Mass, and Time', periods: '12', outcomes: 'Accurately measure standard physical quantities' },
      { month: 'August', unit: 'Unit 3: Force & Pressure', topics: 'Types of Forces, Friction, Atmospheric Pressure', periods: '14', outcomes: 'Identify forces acting in daily life scenarios' },
      { month: 'September', unit: 'Unit 4: Simple Machines', topics: 'Levers, Pulleys, Inclined Planes, Mechanical Advantage', periods: '10', outcomes: 'Explain work and efficiency of simple machines' },
      { month: 'October', unit: 'Revision & Half-Yearly Exams', topics: 'Units 1 to 4 Review', periods: '8', outcomes: 'Consolidate term 1 knowledge' },
      { month: 'November', unit: 'Unit 5: Light Energy', topics: 'Reflection, Lenses, Shadows, Solar/Lunar Eclipses', periods: '12', outcomes: 'Draw ray diagrams for reflection and image formation' },
      { month: 'December', unit: 'Unit 6: Heat Energy', topics: 'Conduction, Convection, Radiation, Thermometers', periods: '10', outcomes: 'Differentiate modes of heat transfer' },
      { month: 'January', unit: 'Unit 7: Sound', topics: 'Vibration, Propagation, Pitch and Loudness', periods: '10', outcomes: 'Relate sound characteristics to amplitude and frequency' },
      { month: 'February', unit: 'Unit 8: Electricity', topics: 'Circuits, Conductors, Insulators, Safety Measures', periods: '12', outcomes: 'Construct simple electrical series/parallel circuits' },
      { month: 'March', unit: 'Annual Revision & Final Assessment', topics: 'Complete Syllabus Review', periods: '10', outcomes: 'Demonstrate subject mastery' }
    ]
  },
  {
    subject: 'MATHS',
    grade: 'Grade 6',
    yearPlan: [
      { month: 'June', unit: 'Chapter 1: Number System', topics: 'Large Numbers, Place Value, Indian & International System', periods: '12', outcomes: 'Compare and operate on large numbers' },
      { month: 'July', unit: 'Chapter 2: Whole Numbers & Integers', topics: 'Properties of Operations, Number Line Addition/Subtraction', periods: '14', outcomes: 'Solve integer-based word problems' },
      { month: 'August', unit: 'Chapter 3: Fractions & Decimals', topics: 'Types of Fractions, Arithmetic Operations on Decimals', periods: '15', outcomes: 'Convert and perform operations on decimals and fractions' },
      { month: 'September', unit: 'Chapter 4: Basic Geometry', topics: 'Points, Lines, Angles, Triangles, Quadrilaterals', periods: '12', outcomes: 'Classify angles and geometric shapes' },
      { month: 'October', unit: 'Revision & Mid-Term Assessments', topics: 'Chapters 1 to 4 Review', periods: '8', outcomes: 'Evaluate problem-solving speed and accuracy' },
      { month: 'November', unit: 'Chapter 5: Algebra Basics', topics: 'Variables, Constants, Simple Equations', periods: '12', outcomes: 'Formulate and solve one-variable linear equations' },
      { month: 'December', unit: 'Chapter 6: Ratio & Proportion', topics: 'Unitary Method, Ratios, Equivalent Ratios', periods: '10', outcomes: 'Apply unitary method to real-life problems' },
      { month: 'January', unit: 'Chapter 7: Mensuration', topics: 'Perimeter and Area of Rectangles and Squares', periods: '12', outcomes: 'Calculate area and boundary length of 2D shapes' },
      { month: 'February', unit: 'Chapter 8: Data Handling', topics: 'Pictographs, Bar Graphs, Tally Marks', periods: '10', outcomes: 'Represent and interpret raw statistical data' },
      { month: 'March', unit: 'Final Review & Practice Tests', topics: 'Comprehensive Practice', periods: '10', outcomes: 'Complete final examination successfully' }
    ]
  }
];

// -------------------------------------------------------------
// 🚀 RUN SEED PROCESS
// -------------------------------------------------------------
async function seedDatabase() {
  try {
    await mongoose.connect(dbConnectionUri);
    console.log('✅ Connected to MongoDB for seeding...');

    for (const plan of masterPlansData) {
      await MasterYearPlan.findOneAndUpdate(
        { subject: plan.subject, grade: plan.grade },
        plan,
        { upsert: true, new: true }
      );
      console.log(`📌 Seeded: ${plan.subject} - ${plan.grade}`);
    }

    console.log('🎉 Master Year Plans uploaded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seedDatabase();