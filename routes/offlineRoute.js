import express from "express";
import {
  submitExam,
  deleteExam,
  addSessionToExamWithoutSession,
} from "../controller/OfflineExam.js";
import {
  addSessionToMarks,
  getMark,
  getMarkbyStudent,
  getMarkbyStudentwithoutsession,
  getScores,
  saveMark,
  updateMark,
  updateMarks,
} from "../controller/offMarkController.js";

const router = express.Router();

//CREATE route
router.post("/offlineexam", submitExam);
router.post("/addSessionToExamWithoutSession", addSessionToExamWithoutSession);
router.post("/save-marks/:sessionId", saveMark);
// Add the new route for getting scores
router.get("/get-scores/:examName/:sessionId", getMark);

router.get(
  "/get-scores-by-student/:studentId/:sessionId",
  // authenticateUser,
  getMarkbyStudent
);
router.get(
  "/get-scored-by-student/:studentId",
  // authenticateUser,
  getMarkbyStudentwithoutsession
);
router.post("/add-session-to-marks", addSessionToMarks);

router.get("/get-all-scores/:examId/:subjectId", getScores);

router.put("/update-all-marks", updateMarks);

router.put("/update-marks/:studentId", updateMark);
router.delete("/deleteexam/:examId", deleteExam);

export default router;
