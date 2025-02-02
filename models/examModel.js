import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },

    date: {
      type: Date,
      // required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session", // Reference to the Session model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", ExamSchema);
