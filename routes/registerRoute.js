import express from "express";
import {
  getAllRegistrations,
  saveRegistrationStep,
} from "../controller/registerController.js"; // Import the controller function

const router = express.Router();

// Route for saving or updating registration step
router.post("/save-step", saveRegistrationStep);
router.get("/get-all", getAllRegistrations);

export default router;
