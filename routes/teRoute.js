import express from "express";
import { getTeachers, createTeacher } from "../controller/teacherController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-teachers", authenticateUser, createTeacher);
// router.get("/get-teachers", getTeachers);

router.get("/get-teachers/:sessionId", getTeachers);

export default router;
