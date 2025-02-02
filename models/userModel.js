import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "parent", "student"], // Add other roles as needed
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Include additional fields that are common to all user roles
    address: {
      type: String,
      // required: true,
    },
    phone: {
      type: Number,
      // required: true,
    },
    // Include fields specific to teachers
    // Example:
    subjectTaught: {
      type: String, // Add teacher-specific fields as needed
    },
    // Include fields specific to students
    // Example:
    studentName: {
      type: String, // Add student-specific fields as needed
    },
    AdmNo: {
      type: String,
    },
    classname: {
      type: String,
    },

    parentsName: {
      type: String,
    },

    gender: {
      type: String,
    },
    // session: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Session", // Reference to the Session model
    //   required: true,
    // },
    session: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
