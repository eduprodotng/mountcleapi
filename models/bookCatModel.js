import mongoose from "mongoose";

const CatSchema = new mongoose.Schema(
  {
    catName: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cat", CatSchema);
