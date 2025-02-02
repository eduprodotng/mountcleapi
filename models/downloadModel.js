import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  className: {
    type: String,
  },
  subject: {
    type: String,
  },

  Downloads: {
    type: String,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session model
    required: true,
  },
});

const Download = mongoose.model("Download", downloadSchema); // Change "School" to "Account"

export default Download;
