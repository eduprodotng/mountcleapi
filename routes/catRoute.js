import express from "express";

import { createCat } from "../controller/catController.js";

const router = express.Router();

//CREATE
router.post("/category", createCat);
// router.delete("/grade/:id", deleteGrade);

// router.get("/grade", getGrade);
// router.get("/grade/find/:id", getsingleGrade);
// router.put("/grade/:id", updateGrade);

// router.delete("/grade/:id", deleteGrade);
export default router;
