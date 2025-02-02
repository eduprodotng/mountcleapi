// Import Mongoose
import mongoose from "mongoose";

// Define a schema for the student theory score
// Mongoose schema definition
const studentTheoryScoreSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Reference to the Class model
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // Reference to the Subject model
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  questionNumber: {
    type: String,
    required: true,
  },
  outOfScore: {
    type: Number,
    required: true,
  },
  scoreGiven: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("StudentTheoryScore", studentTheoryScoreSchema);
