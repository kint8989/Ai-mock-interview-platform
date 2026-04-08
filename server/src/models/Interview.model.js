import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    isCodeQuestion: { type: Boolean, required: true, default: false },
    codeType: { type: String, default: '' },
    codeLanguage: { type: String, default: '' },
    codeSnippet: { type: String, default: '' },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['interviewer', 'candidate'],
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: { type: String, required: true },
    resumeText: { type: String, default: '' },
    totalQuestions: { type: Number, default: 0 },
    currentQuestion: { type: Number, default: 0 },
    questions: { type: [questionSchema], default: [] },
    messages: { type: [messageSchema], default: [] },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    lastAudio: { type: String, default: '' },
    overallScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
