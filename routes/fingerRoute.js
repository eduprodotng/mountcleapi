import express from "express";

import {
  getAllFingers,
  saveFingerStep,
} from "../controller/fingerController.js";

const router = express.Router();

// Route for saving or updating registration step
router.post("/save-finger", saveFingerStep);
router.get("/fingers", getAllFingers);
export default router;
