import Receipt from "../models/receiptModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

export const getInvoiceId = async (req, res) => {
  const invId = req.params.id;

  try {
    // Find the Invoice by ID
    const invoice = await Receipt.findOne({
      _id: invId,
    }).exec();

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get invoice" });
  }
};

export const getStudentInvoiceId = async (req, res) => {
  const invId = req.params.id;

  try {
    // Find the invoices of a student by ID and populate the student field
    const invoice = await Receipt.find({
      student: invId,
    })
      .populate("student")
      .exec();

    if (!invoice) {
      return res.status(404).json({ error: "Invoice Of student not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get invoice" });
  }
};

export const getAll = async (req, res) => {
  try {
    const receipts = await Receipt.find().populate("student");
    res.status(200).json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteInv = async (req, res) => {
  const receiptId = req.params.id;
  Receipt.deleteOne({ _id: receiptId }, (err) => {
    if (err) {
      res.status(500).send("Failed to delete the receipt");
    } else {
      res.status(200).send("Receipt deleted successfully");
    }
  });
};

// controllers/receiptController.js
// controllers/receiptController.js
// export const createReceipt = async (req, res) => {
//   try {
//     const {
//       typeOfPayment,
//       status,
//       reason,
//       studentName,
//       classname,
//       paid,
//       amount,
//       date,
//     } = req.body;

//     console.log("Request Body:", req.body); // Log the entire request body

//     // Check if the student with the provided name exists
//     const student = await User.findOne({ studentName, classname });

//     if (!student) {
//       console.log("Student not found:", { studentName, classname });
//       return res.status(404).json({ error: "Student not found" });
//     }

//     console.log("Student found:", student);

//     // Create a receipt
//     const receipt = await Receipt.create({
//       typeOfPayment,
//       status,
//       reason,
//       studentName,
//       classname,
//       paid,
//       amount,
//       date,
//     });

//     console.log("Receipt created:", receipt);

//     // Include the student's ID in the response
//     const response = {
//       receipt,
//       studentId: student._id, // Assuming the student model has an '_id' field
//     };

//     return res.status(201).json(response);
//   } catch (error) {
//     console.error("Error creating receipt:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const createReceipt = async (req, res) => {
  try {
    const {
      typeOfPayment,
      status,
      reason,
      studentName,
      classname,
      paid,
      amount,
      date,
      sessionId, // Add sessionId from the request body
    } = req.body;

    console.log("Request Body:", req.body);

    // Check if the student with the provided name and class exists in the given session
    const sessionObjectId = mongoose.Types.ObjectId(sessionId); // Convert sessionId to ObjectId if necessary

    const student = await User.findOne({
      studentName,
      classname,
      session: sessionObjectId, // Ensure the student belongs to the correct session
    });

    if (!student) {
      console.log("Student not found:", { studentName, classname, sessionId });
      return res
        .status(404)
        .json({ error: "Student not found in the specified session" });
    }

    console.log("Student found:", student);

    // Create a new receipt associated with the session and student
    const receipt = await Receipt.create({
      typeOfPayment,
      status,
      reason,
      studentName,
      classname,
      session: sessionObjectId, // Add session ID to the receipt
      paid,
      amount,
      date,
    });

    console.log("Receipt created:", receipt);

    // Include the student's ID in the response
    const response = {
      receipt,
      studentId: student._id, // Assuming the student model has an '_id' field
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the receipt by ID
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      console.log("Receipt not found for ID:", id);
      return res.status(404).json({ error: "Receipt not found" });
    }

    console.log("Receipt found:", receipt);

    return res.status(200).json(receipt);
  } catch (error) {
    console.error("Error fetching receipt by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// controllers/receiptController.js

export const getReceiptsByStudentsId = async (req, res) => {
  const studentId = req.params.id;

  try {
    // Find the receipts associated with the student ID
    const receipts = await Receipt.find({ studentId });

    if (!receipts || receipts.length === 0) {
      return res
        .status(404)
        .json({ error: "Receipts not found for the student ID" });
    }

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error retrieving receipts:", error);
    return res.status(500).json({ error: "Failed to get receipts" });
  }
};

// controllers/receiptController.js
// controllers/receiptController.js

// controllers/receiptController.js
export const getReceiptsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("Requested studentId:", studentId);

    // Check if the student with the provided ID exists
    const student = await User.findById(studentId);

    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ error: "Student not found" });
    }

    console.log("Fetched student:", student);

    // Find all receipts for the student
    const receipts = await Receipt.find({ studentName: student.username });

    console.log("Fetched receipts:", receipts);

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllReceipts = async (req, res) => {
  const { sessionId } = req.params; // Extract the session ID from the route parameters

  try {
    // Convert sessionId to ObjectId if stored as ObjectId in the database
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    console.log("Session ID:", sessionId); // Log the sessionId
    console.log("Session ObjectId:", sessionObjectId); // Log the converted ObjectId

    // Find all receipts for the specified session
    const receipts = await Receipt.find({ session: sessionObjectId }).exec();

    console.log("Receipts found:", receipts); // Log the receipts found

    if (receipts.length === 0) {
      return res
        .status(404)
        .json({ error: "No receipts found for the specified session" });
    }

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addSessionToReceiptWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Receipt.updateMany(
      { session: { $exists: false } }, // Find users without a session field
      { $set: { session: sessionId } } // Set the session field
    );

    res.status(200).json({
      message: "Users updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
