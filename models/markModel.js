import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    marks: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        examscore: { type: Number, required: true },
        testscore: { type: Number, required: true },
        marksObtained: { type: Number, required: true },
        comment: { type: String },
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
export default mongoose.model("Mark", MarkSchema);
