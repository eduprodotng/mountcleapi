import mongoose from "mongoose";

const LessonNoteSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  content: {
    type: String,
    required: true, // Ensure the generated content is saved
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LessonNote = mongoose.model("LessonNote", LessonNoteSchema);

export default LessonNote;
