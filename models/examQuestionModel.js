// models/ExamQuestion.js

import mongoose from "mongoose";

const ExamQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  fromTime: {
    type: String, // Assuming a format like "HH:mm"
    required: true,
  },
  toTime: {
    type: String, // Assuming a format like "HH:mm"
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
  instruction: {
    type: String,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session model
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
    required: true,
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

const ExamQuestion = mongoose.model("ExamQuestion", ExamQuestionSchema);

export default ExamQuestion;
