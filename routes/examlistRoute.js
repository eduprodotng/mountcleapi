// examRoutes.js
import express from "express";
import {
  createExam,
  getAllExams,
  getExamById,
  deleteExam,
  getExamsByClass,
  getExamForStudent,
  getTheoryAnswer,
  getTheoryAnswerByName,
  editExam,
  saveStudentTheoryScore,
  getStudentTheoryScoresByExam,
  getStudentTheoryScoresByExamAndStudent,
  calculateTotalScore,
  getStudentTheoryScoresByStudent,
  // saveTotalScores,
  getStudentTheoryScoresByStudentAndClassNameAndSubject,
  addSessionToOnlineExamWithoutSession,
} from "../controller/examlistController.js";
import authenticateUser from "../middleware/authMiddleware.js";
const router = express.Router();

// Create a new exam (accessible only to admins)
router.post("/create-exam", authenticateUser, createExam);
router.post(
  "/save-student-theory-score",

  saveStudentTheoryScore
);
router.post(
  "/addSessionToOnlineExamWithoutSession",
  addSessionToOnlineExamWithoutSession
);
router.get("/get-exam/:sessionId", getAllExams);
// router.post("/save-total-scores", saveTotalScores);
router.get("/get-exam-by-id/:id/:sessionId", getExamById);
router.get(
  "/student-theory-scores/:studentId",
  getStudentTheoryScoresByStudent
);
router.get(
  "/student-theory-scores/:className/:studentName/:subjectName",
  getStudentTheoryScoresByStudentAndClassNameAndSubject
);

router.get(
  "/get-exams-by-class/:classId/:sessionId",
  authenticateUser,
  getExamsByClass
);

// Get a list of all exams

// router.get("/get-exam", getAllExams);

router.get("/student-theory-scores/:examId", getStudentTheoryScoresByExam);
router.get(
  "/student-theory-scores/:examId/:studentId",
  getStudentTheoryScoresByExamAndStudent
);

router.get("/calculate-total-score/:studentId", calculateTotalScore);

// Get a specific exam by ID

// Get a specific exam for a specific student by IDs
router.get("/get-exam/:examId/student/:studentId", getExamForStudent);

// router.get(
//   "/get-theory-answer/className/:studentId/:subjectId",
//   getTheoryAnswer
// );
router.get(
  "/get-theory-answer/className/:className/student/:studentId/subject/:subject",
  getTheoryAnswer
);

router.get(
  "/get-theory-answer-by-name/className/:className/student/:studentName/subject/:subject",
  getTheoryAnswerByName
);
// Edit an existing exam (accessible only to admins)
router.put("/edit-exam/:examId", editExam);

// Update an existing exam by ID (accessible only to admins)
// router.put("/:id", updateExam);

// Delete an exam by ID (accessible only to admins)
router.delete("/exam/:id", deleteExam);

export default router;
