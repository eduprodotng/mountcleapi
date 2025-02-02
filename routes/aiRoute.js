// examRoutes.js

import express from "express";

import authenticateUser from "../middleware/authMiddleware.js";
import {
  generateAllFields,
  generateFieldTopic,
  generateGeneralQuestion,
  generateLessonNote,
  generateQuestion,
  generateTopic,
  getAllSavedFields,
} from "../controller/aiController.js";

const router = express.Router();

// Create a route for submitting an exam
router.post("/generate-questions", authenticateUser, generateQuestion);
router.post(
  "/generate-gen-question",

  generateGeneralQuestion
);

router.post("/generate-lesson-note", authenticateUser, generateLessonNote);
router.post("/generate-topics", generateTopic);
router.post("/generate-field-topic", generateFieldTopic);
router.post("/generate-fields", generateAllFields);

// Route to get all saved fields
router.get("/fields", getAllSavedFields);

export default router;
