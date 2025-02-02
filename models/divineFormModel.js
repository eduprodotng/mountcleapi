// models/Fibroid.js
import mongoose from "mongoose";

const DivineFormSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  supplement: {
    type: String,
  },
  bottle: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  request: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("DivineForm", DivineFormSchema);
