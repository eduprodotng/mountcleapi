import Subject from "../models/subModel.js";
import User from "../models/userModel.js";
import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";

export const createSubject = async (req, res) => {
  const { name, teacher, classname, session } = req.body; // Add session to the request body

  try {
    // Find the teacher and class documents by name
    const teacherDocument = await User.findOne({
      username: teacher,
      role: "teacher",
    });
    const classDocument = await Class.findOne({ name: classname });

    if (!teacherDocument || !classDocument) {
      // Handle errors if the teacher or class isn't found
      res.status(404).json({ error: "Teacher or class not found" });
      return;
    }

    // If session is provided, add it to the subject
    const newSub = new Subject({
      name,
      teacher: teacherDocument.username, // Store teacher's username
      classname: classDocument.name, // Store class name
      session, // Store session
    });

    const savedSub = await newSub.save();
    res.status(200).json(savedSub);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addSessionToSubjectWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Subject.updateMany(
      { session: { $exists: false } }, // Find users without a session field
      { $set: { session: sessionId } } // Set the session field
    );

    res.status(200).json({
      message: "Notice updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
export const updateSubject = async (req, res) => {
  const { subjectId } = req.params;
  const { name, teacher, classname } = req.body;

  try {
    // Find the subject by ID
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      // If subject not found, return error
      return res.status(404).json({ error: "Subject not found" });
    }

    // Update the subject properties
    subject.name = name;
    subject.teacher = teacher;
    subject.classname = classname;

    // Save the updated subject
    const updatedSubject = await subject.save();

    // Send back the updated subject as response
    res.status(200).json(updatedSubject);
  } catch (error) {
    // Handle errors
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getallSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json(err);
  }
};

// export const getSubjectsByClass = async (req, res) => {
//   const { classname } = req.params; // Extract the class name from the route parameters

//   try {
//     const subjects = await Subject.find({ classname }); // Find subjects with the specified class name
//     res.status(200).json(subjects);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
export const getSubjectsByClass = async (req, res) => {
  const { classname, sessionId } = req.params; // Extract the class name and session ID from the route parameters

  try {
    // Convert sessionId to ObjectId if needed
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find subjects with the specified class name and session ID
    const subjects = await Subject.find({
      classname,
      session: sessionObjectId,
    }).exec();

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        error: "No subjects found for the specified class and session",
      });
    }

    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to get subjects" });
  }
};

// Update the getStudentSubjects function
export const getStudentSubjects = async (req, res) => {
  const { classname } = req.user.user;
  console.log("Class Name:", classname);

  try {
    // Fetch the subjects based on the classname
    const subjects = await Subject.find({ classname }, "name"); // Only fetch the 'name' property
    console.log("Subjects found:", subjects);
    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Import necessary modules and models

export const deleteSubject = async (req, res) => {
  const { subjectId } = req.params; // Extract the subject ID from the route parameters

  try {
    // Find and delete the subject by ID
    const deletedSubject = await Subject.findByIdAndDelete(subjectId);

    if (!deletedSubject) {
      // If subject not found, return an error
      return res.status(404).json({ error: "Subject not found" });
    }

    res
      .status(200)
      .json({ message: "Subject deleted successfully", deletedSubject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
