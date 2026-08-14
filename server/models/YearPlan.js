import mongoose from 'mongoose';

// Row schema for individual month/topic entries inside the Year Plan
const rowSchema = new mongoose.Schema({
  rowId: Number,
  month: String,
  ncertSyllabus: String,
  assessments: String,
  iitSyllabus: String,
  section1: String,
  section2: String,
  section3: String,
  section4: String,
  section5: String,
  section6: String,
  status: {
    type: String,
    enum: ['Not Assigned', 'In Progress', 'Completed'],
    default: 'Not Assigned'
  }
});

// Master or Teacher Year Plan Schema
const yearPlanSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false // Optional for master templates, required for active teachers
  },
  teacherName: {
    type: String,
    required: true,
    default: 'Master Template'
  },
  fileName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grades: {
    type: [String],
    required: true
  },
  blockName: {
    type: String,
    required: true
  },
  excelData: [rowSchema]
}, { timestamps: true });

const YearPlan = mongoose.model('YearPlan', yearPlanSchema);

export default YearPlan;