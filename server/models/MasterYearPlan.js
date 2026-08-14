import mongoose from 'mongoose';

const PlanItemSchema = new mongoose.Schema({
  month: { type: String, default: '' },
  unit: { type: String, default: '' },
  topics: { type: String, default: '' },
  periods: { type: String, default: '' },
  outcomes: { type: String, default: '' }
});

const MasterYearPlanSchema = new mongoose.Schema({
  blockName: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  yearPlan: [PlanItemSchema]
});

// Ensures a unique combination of blockName, subject, and grade
MasterYearPlanSchema.index({ blockName: 1, subject: 1, grade: 1 }, { unique: true });

export default mongoose.model('MasterYearPlan', MasterYearPlanSchema);
