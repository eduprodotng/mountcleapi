import mongoose from "mongoose";

const FingerSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    fullname: { type: String },
    country: {
      type: String,
      enum: ["nigeria", "ghana", "southafrica", "togo"],
    },
    state: {
      type: String,
      enum: ["lagos", "kano", "portharcourt", "oyo"],
    },
    denomination: { type: String },
    position: { type: String },
    referred: {
      type: String,
      enum: ["no", "yes"],
    },
    who: { type: String },
    yourself: { type: String },
    received: { type: String },
    when: { type: String },
    enough: { type: String },
    done: { type: String },
    area: { type: String },
  },
  { timestamps: true } // Moved timestamps here
);

export default mongoose.model("Finger", FingerSchema);
