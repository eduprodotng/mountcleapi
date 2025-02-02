// models/Notice.js
import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    notice: {
      type: String,
      required: true,
    },
    posted_by: {
      type: String,
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

export default mongoose.model("Notice", NoticeSchema);
