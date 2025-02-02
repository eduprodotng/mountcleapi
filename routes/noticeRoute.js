// authRoutes.js
import express from "express";

import {
  addSessionToNoticeWithoutSession,
  createNotice,
  deleteNotice,
  editNotice,
  getNotice,
  getNoticebyId,
  getallNotice,
} from "../controller/noticeController.js";

const router = express.Router();
router.get("/get-notice/:id", getNoticebyId);
router.post("/create-notice", createNotice);
router.post(
  "/addSessionToNoticeWithoutSession",
  addSessionToNoticeWithoutSession
);

router.get("/get-notice/:role", getNotice);

// router.get("/get-all-notices", getallNotice);
router.get("/get-all-notices/:sessionId", getallNotice);

router.put("/edit-notice/:id", editNotice);
router.delete("/delete-notice/:id", deleteNotice);

export default router;
