// routes/fibroidRoutes.js
import express from "express";

import {
  getFibroid,
  getUlcer,
  getHbp,
  getHiv,
  getDiabetes,
  getErectile,
  getStroke,
  createFibroid,
  createStroke,
  createHbp,
  createErectile,
  createHiv,
  createUlcer,
  createDiabetes,
  updateFibroid,
  updateErectile,
  updateStroke,
  updateDiabetes,
  updateHbp,
  updateHiv,
  updateUlcer,
  createForm,
  getForm,
} from "../controller/FibroidController.js";

const router = express.Router();

// Route to get the fibroid description
router.get("/get-fibroid", getFibroid);
router.get("/get-ulcer", getUlcer);
router.get("/get-stroke", getStroke);
router.get("/get-diabetes", getDiabetes);
router.get("/get-erectile", getErectile);
router.get("/get-hbp", getHbp);
router.get("/get-hiv", getHiv);
router.get("/contact-form", getForm);

router.post("/post-contact-form", createForm);
router.post("/create-fibroid", createFibroid);
router.post("/create-ulcer", createUlcer);
router.post("/create-diabetes", createDiabetes);
router.post("/create-hbp", createHbp);
router.post("/create-hiv", createHiv);
router.post("/create-stroke", createStroke);
router.post("/create-erectile", createErectile);

// Route to update the fibroid description
router.put("/put-fibroid", updateFibroid);
router.put("/put-stroke", updateStroke);
router.put("/put-erectile", updateErectile);
router.put("/put-hiv", updateHiv);
router.put("/put-hbp", updateHbp);
router.put("/put-ulcer", updateUlcer);
router.put("/put-diabetes", updateDiabetes);

export default router;
