import express from "express";
import {
  addSessionToClassWithoutSession,
  createClass,
  deleteClass,
  getClass,
  getsingleClass,
  updateClass,
} from "../controller/classController.js";

const router = express.Router();

//CREATE
router.post("/class", createClass);
router.post(
  "/addSessionToClassWithoutSession",
  addSessionToClassWithoutSession
);

// router.get("/class", getClass);
router.get("/class/:sessionId", getClass);

router.get("/class/:id", getsingleClass);

// Update a class
router.put("/class/:id", updateClass);
router.delete("/class/:id", deleteClass);

export default router;
