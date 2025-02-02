import express from "express";
import {
  deleteGrade,
  getGrade,
  getsingleGrade,
  createGrade,
  updateGrade,
  addSessionToGradeWithoutSession,
} from "../controller/gradeController.js";

const router = express.Router();

//CREATE
router.post("/grade", createGrade);
// router.delete("/grade/:id", deleteGrade);

router.post(
  "/addSessionToGradeWithoutSession",
  addSessionToGradeWithoutSession
);

router.get("/grade/:sessionId", getGrade);
router.get("/grade/find/:id", getsingleGrade);
router.put("/grade/:id", updateGrade);

router.delete("/grade/:id", deleteGrade);
export default router;
