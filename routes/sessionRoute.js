// routes/sessionRoutes.js
import express from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  setActiveSession,
} from "../controller/sessionController.js";

const router = express.Router();

// Create a new session
router.post("/", createSession);

// Get all sessions
router.get("/", getSessions);

// Get a session by ID
router.get("/:id", getSessionById);

// Update a session
router.put("/:id", updateSession);
router.patch("/:id/activate", setActiveSession);
// Delete a session
router.delete("/:id", deleteSession);

// Set a session as active

export default router;
