// models/Fibroid.js
import mongoose from "mongoose";

const ErectileSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Erectile", ErectileSchema);
