import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },

  studentName: {
    type: String,
  },

  answerScriptFiles: {
    type: Array,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session model
    required: true,
  },
});

const Script = mongoose.model("Script", scriptSchema); // Change "School" to "Account"

export default Script;
