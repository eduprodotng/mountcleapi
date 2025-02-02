import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";

// export const createClass = async (req, res) => {
//   try {
//     const latestClass = await Class.findOne({}, {}, { sort: { classId: -1 } });
//     const nextClassId = (latestClass && latestClass.classId + 1) || 1;

//     const newClass = new Class({
//       classId: nextClassId,
//       name: req.body.name,
//       teacher: req.body.teacher,
//       students: [], // Initialize an empty array for students
//     });

//     const savedClass = await newClass.save();
//     res.status(200).json(savedClass);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
export const createClass = async (req, res) => {
  try {
    // Fetch the latest class to determine the next classId
    const latestClass = await Class.findOne({}, {}, { sort: { classId: -1 } });
    const nextClassId = (latestClass && latestClass.classId + 1) || 1;

    // Create a new class with the provided data and session
    const newClass = new Class({
      classId: nextClassId,
      name: req.body.name,
      teacher: req.body.teacher,
      students: [], // Initialize an empty array for students
      session: req.body.session, // Add the session field
    });

    // Save the new class to the database
    const savedClass = await newClass.save();
    res.status(200).json(savedClass);
  } catch (err) {
    res.status(500).json({ error: "Failed to create class" });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClass);
  } catch (err) {
    res.status(500).json(err);
  }
};

// export const getClass = async (req, res) => {
//   try {
//     const classes = await Class.find().populate("students");
//     res.status(200).json(classes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
export const getClass = async (req, res) => {
  const { sessionId } = req.params; // Extract the session ID from the route parameters

  try {
    // Convert sessionId to ObjectId if needed
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find classes with the specified session ID and populate students
    const classes = await Class.find({ session: sessionObjectId })
      .populate("students")
      .exec();

    if (classes.length === 0) {
      return res
        .status(404)
        .json({ error: "No classes found for the specified session" });
    }

    res.status(200).json(classes);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ error: "Failed to get classes" });
  }
};

export const getsingleClass = async (req, res, next) => {
  try {
    const classes = await Class.findById(req.params.id).populate("students");
    const totalStudents = classes.students.length;

    res.status(200).json({ ...classes.toObject(), totalStudents });
  } catch (err) {
    next(err);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json("Class has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const addSessionToClassWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Class.updateMany(
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
