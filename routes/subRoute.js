import express from "express";
import {
  addSessionToSubjectWithoutSession,
  createSubject,
  deleteSubject,
  // deleteSubject,
  getallSubject,
  getStudentSubjects,
  getSubjectsByClass,
  updateSubject,
} from "../controller/subController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-subject", authenticateUser, createSubject);
router.post(
  "/addSessionToSubjectWithoutSession",
  addSessionToSubjectWithoutSession
);
router.get("/get-subject", authenticateUser, getallSubject);

// router.get("/get-subject/:classname", getSubjectsByClass);
router.get("/get-subject/:classname/:sessionId", getSubjectsByClass);

router.get("/get-student-subjects", authenticateUser, getStudentSubjects);
router.put("/update-subject/:subjectId", updateSubject);

router.delete("/delete-subject/:subjectId", deleteSubject);
export default router;
