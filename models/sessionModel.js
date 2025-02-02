// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 2022/2023
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false }, // To mark the current active session
});

export default mongoose.model("Session", sessionSchema);
