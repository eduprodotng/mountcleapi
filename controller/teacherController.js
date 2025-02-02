import express from "express";
import mongoose from "mongoose";
import User from "../models/userModel.js"; // Replace with your actual model

const router = express.Router();

// Create a Teacher (Authenticated Route)

export const createTeacher = async (req, res) => {
  try {
    // Verify the user role (only "admin" can create teachers)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Create a teacher (You may customize this)
    const teacher = new User({
      role: "teacher",
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,

      // subjectTaught: req.body.subjectTaught, // Add other teacher-specific fields
    });

    const createdTeacher = await teacher.save();
    res.status(201).json(createdTeacher);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Teachers (Authenticated Route)

// export const getTeachers = async (req, res) => {
//   try {
//     // Verify the user role (only "admin" can get teachers)
//     // if (req.user.role !== "admin") {
//     //   return res.status(403).json({ message: "Permission denied" });
//     // }

//     const teachers = await User.find({ role: "teacher" });
//     res.status(200).json(teachers);
//   } catch {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const getTeachers = async (req, res) => {
  const { sessionId } = req.params; // Assuming sessionId is passed as a route parameter

  try {
    // Convert sessionId to ObjectId if needed
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Fetch teachers for the specified session
    const teachers = await User.find({
      role: "teacher",
      session: sessionObjectId, // Filter teachers by session
    })
      .select("username email address phone _id") // Adjust fields as needed
      .exec();

    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found for that session" });
    }

    return res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export default router;
