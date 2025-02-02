import mongoose from "mongoose";

const GenerateFieldSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "field",
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional: Link to a user
    },
  },
  { timestamps: true }
);

export default mongoose.model("GenerateField", GenerateFieldSchema);
