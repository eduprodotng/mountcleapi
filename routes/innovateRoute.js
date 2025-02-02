import express from "express";

import { createInnovate } from "../controller/innovateController.js";

const router = express.Router();

router.post("/innovate", createInnovate);

export default router;
