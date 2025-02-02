import express from "express";
import {
  submitPractice,
  getQuestions,
} from "../controller/practicePqController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Use multer as middleware in the route
router.post("/submit-practice-questions", authenticateUser, submitPractice);
router.get("/get-practice-questions/:subjectName", getQuestions); // Corrected typo

export default router;
