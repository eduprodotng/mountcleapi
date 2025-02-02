import Grade from "../models/gradeModel.js";

import mongoose from "mongoose";

import Session from "../models/sessionModel.js";
// export const createGrade = async (req, res) => {
//   const newGrade = new Grade(req.body);
//   try {
//     const savedGrade = await newGrade.save();
//     res.status(200).json(savedGrade);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createGrade = async (req, res) => {
  const { session, ...gradeData } = req.body; // Extract sessionId from the request body
  try {
    // Ensure sessionId is valid
    if (!mongoose.Types.ObjectId.isValid(session)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }
    // Create a new grade, including the session ID
    const newGrade = new Grade({
      ...gradeData, // Include the rest of the grade data
      session: session, // Add session ID to the grade
    });

    // Save the new grade to the database
    const savedGrade = await newGrade.save();
    console.log("Saved Grade:", savedGrade);

    // Respond with the saved grade
    res.status(200).json(savedGrade);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
//GET RESULT
// export const getGrade = async (req, res) => {
//   try {
//     const list = await Grade.find();
//     res.status(200).json(list);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

export const getGrade = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Convert sessionId to ObjectId if necessary
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Fetch grades for the specified session
    const grades = await Grade.find({ session: sessionObjectId });

    if (!grades || grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No grades found for the specified session",
      });
    }

    res.status(200).json({ success: true, data: grades });
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getsingleGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);
    res.status(200).json(grade);
  } catch (err) {
    next(err);
  }
};
// export const deleteGrade = async (req, res, next) => {
//   try {
//     await Grade.findByIdAndDelete(req.params.id);
//     res.status(200).json("Grade has been deleted.");
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    await grade.remove();

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.error("Error deleting grade:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    // Update grade properties based on the request body
    grade.grade_name = req.body.grade_name;
    grade.gradepoint = req.body.gradepoint;
    grade.markfrom = req.body.markfrom;
    grade.markupto = req.body.markupto;
    grade.comment = req.body.comment;

    await grade.save();

    res.status(200).json({ message: "Grade updated successfully", grade });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addSessionToGradeWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Grade.updateMany(
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
