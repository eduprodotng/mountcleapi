import Exam from "../models/examModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";

// export const submitExam = async (req, res) => {
//   const newExam = new Exam(req.body); // Include the "score" in the destructuring

//   try {
//     const savedExam = await newExam.save();
//     res.status(200).json(savedExam);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const submitExam = async (req, res) => {
  const { session, ...examData } = req.body; // Extract session from req.body

  try {
    // Create a new exam with the session included
    const newExam = new Exam({
      ...examData,
      session, // Add session to the exam data
    });

    const savedExam = await newExam.save();
    res.status(200).json(savedExam);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getExam = async (req, res) => {
  const { sessionId } = req.params; // Extract the session ID from the route parameters

  try {
    // Convert sessionId to ObjectId if needed
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find exams with the specified session ID
    const list = await Exam.find({ session: sessionObjectId }).exec();

    if (list.length === 0) {
      return res
        .status(404)
        .json({ error: "No exams found for the specified session" });
    }

    res.status(200).json(list);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the exams" });
  }
};

// Save exam marks
export const deleteExam = async (req, res) => {
  const examId = req.params.examId;

  try {
    // Find and delete the exam by ID
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      // If exam is not found
      return res.status(404).json({ error: "Exam not found" });
    }

    // Respond with a success message or additional data if needed
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addSessionToExamWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Exam.updateMany(
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
