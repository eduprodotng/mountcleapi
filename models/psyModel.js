import mongoose from "mongoose";

const PsySchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    marks: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        instruction: { type: Number },
        independently: { type: Number },
        punctuality: { type: Number },
        talking: { type: Number },
        eyecontact: { type: Number },
        remarks: { type: String },
        premarks: { type: String },
      },
    ],
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session", // Reference to the Session model
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Psy", PsySchema);
