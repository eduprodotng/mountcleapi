// models/Fibroid.js
import mongoose from "mongoose";

const UlcerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Ulcer", UlcerSchema);
