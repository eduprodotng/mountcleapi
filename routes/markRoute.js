import express from "express";
import {
  createMark,
  deleteMark,
  getMark,
  getsingleMark,
} from "../controller/markController.js";

const router = express.Router();

//CREATE
router.post("/", createMark);
router.delete("/:id", deleteMark);

router.get("/:term/:classname/:subject", getMark);
router.get("/find/:id", getsingleMark);

export default router;
