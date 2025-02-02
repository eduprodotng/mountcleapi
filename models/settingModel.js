// // schoolModel.js
// import mongoose from "mongoose";

// const settingSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
//   signature: {
//     type: String, // You can store the file path or base64 representation
//   },
//   principalName: {
//     type: String,
//   },
//   resumptionDate: {
//     type: Date,
//   },
//   examName: {
//     type: String, // Add examName to the schema
//     required: true,
//   },
//   session: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Session", // Reference to the Session model
//     required: true,
//   },
// });

// const School = mongoose.model("Setting", settingSchema);

// export default School;
// schoolModel.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Add validation for name
  },
  signature: {
    type: String, // You can store the file path or base64 representation
  },
  principalName: {
    type: String,
    required: true, // Add validation for principalName
  },
  resumptionDate: {
    type: Date,
    required: true, // Add validation for resumptionDate
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam", // Reference to the Exam model, instead of storing a string name
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session model
    required: true,
  },
});

const School = mongoose.model("Setting", settingSchema);

export default School;
