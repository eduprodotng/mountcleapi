import express from "express";

import {
  addSessionToReceiptWithoutSession,
  createReceipt,
  deleteInv,
  getAllReceipts,
  getReceiptById,
  //   getInvoiceId,
  getReceiptsByStudentId,
  getReceiptsByStudentsId,
  getStudentInvoiceId,
} from "../controller/receiptController.js";

const router = express.Router();

router.post("/receipt", createReceipt);
router.post(
  "/addSessionToReceiptWithoutSession",
  addSessionToReceiptWithoutSession
);
router.get("/receipt/:id", getReceiptById);

// routes/receiptRoutes.js
router.get("/receipt/:studentId", getReceiptsByStudentId);

// router.get("/receipt/:id", getInvoiceId);
router.get("/receipt/student/:id", getStudentInvoiceId);
// router.get("/receipt/", getAll);
router.get("/receipt-session/:sessionId", getAllReceipts);

// Define the route in your Express application
router.get("/receipts/student/:id", getReceiptsByStudentsId);

// Define the route with parameters
// Define the route with parameters

router.delete("/receipt/:id", deleteInv);

export default router;
