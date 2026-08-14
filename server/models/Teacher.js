import mongoose from 'mongoose';

const PlanItemSchema = new mongoose.Schema({
  month: { type: String, default: '' },
  unit: { type: String, default: '' },
  topics: { type: String, default: '' },
  periods: { type: String, default: '' },
  outcomes: { type: String, default: '' }
});

const AssignmentSchema = new mongoose.Schema({
  blockName: { type: String, required: true },
  subject: { type: String, required: true },
  grades: [{ type: String }],
  yearPlan: [PlanItemSchema]
});

const TeacherSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  assignments: [AssignmentSchema]
});

export default mongoose.model('Teacher', TeacherSchema);