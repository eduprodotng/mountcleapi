// models/ExamQuestion.js

import mongoose from "mongoose";

const GenQuestionSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },

  questions: [
    {
      questionText: String,
      questionType: {
        type: String,
        enum: ["multiple-choice", "short-answer"],
        default: "short-answer",
      },
      options: [String], // Only for multiple-choice questions
      correctAnswer: String, // Optional, if you want to track the answer
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  submittedAnswers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        select: "studentName", // Select only student name
      },
      answers: {
        type: Map, // Using a Map to store answers with question IDs as keys
        of: String, // Assuming answers are stored as strings
      },
      score: {
        type: Number, // Field to store the exam score for each student
      },
    },
  ],
});

const GenQuestion = mongoose.model("GenQuestion", GenQuestionSchema);

export default GenQuestion;
