import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: String, // Reference to the Teacher model
      ref: "User", // Use the model name defined in User
      required: true,
    },
    classname: {
      type: String, // Reference to the Class model
      ref: "Class", // Define the Class model name
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session", // Reference to the Session model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
