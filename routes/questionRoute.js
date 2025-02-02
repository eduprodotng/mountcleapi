// examRoutes.js
import express from "express";

import authenticateUser from "../middleware/authMiddleware.js";
import {
  createMultipleQuestions,
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
} from "../controller/questionController.js";
const router = express.Router();

// Create a new question
router.post("/questions/:sessionId", authenticateUser, createQuestion);
router.post(
  "/questions/multiple/:sessionId",
  authenticateUser,
  createMultipleQuestions
);

// Retrieve questions for a specific exam
router.get("/questions/:examId", authenticateUser, getQuestions);
router.get("/:questionId", getQuestionById);

// Delete a question by ID
router.delete("/questions/:questionId", authenticateUser, deleteQuestion);
// Create a new route for updating a question
router.put("/questions/:questionId", authenticateUser, updateQuestion);

export default router;
