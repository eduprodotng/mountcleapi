import mongoose from "mongoose";

const innovateSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    instagram: {
      type: String,
    },
    phone: {
      type: String,
    },
    business: {
      type: String,
    },
    problem: {
      type: String,
    },
    hear: {
      type: String,
      enum: [
        "From a friend",
        "From Instagram",
        "From WhatsApp",
        "From Facebook",
        "From the website",
        "Other",
      ],
    },
    invite: {
      type: String,
    },
    plan: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Innovate", innovateSchema);
