import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    program: {
      type: String,
      enum: [
        "Lebana Foundation Program",
        "Higher Education Completion Program",
        "Youth Skill Development Program",
        "Basic Wellness Program",
      ],
    },
    email: { type: String },
    phone: { type: String },
    firstName: { type: String },
    surname: { type: String },
    address: { type: String },
    expectations: { type: String },
    attendanceResponse: {
      type: String,
      enum: ["no", "yes"],
    },
    doing: {
      type: String,
      enum: ["no", "yes", "idk", "other"],
    },
    anyway: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    howgood: {
      type: String,
      enum: ["excellent", "verygood", "good", "beginner", "other"],
    },
    interested: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    skilling: {
      type: String,
      enum: ["three", "two", "one", "idk", "other"],
    },
    earn: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    like: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    confidence: {
      type: String,
      enum: ["high", "average", "low", "no", "other"],
    },
    think: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    currently: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    solver: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    mind: {
      type: String,
      enum: ["cause", "solution", "alternative", "walk", "other"],
    },
    wish: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    personal: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    problemtwo: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    creating: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    serving: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    need: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    happen: {
      type: String,
      enum: ["offer", "process", "think", "notdone", "other"],
    },
    manage: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    future: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    durate: {
      type: String,
      enum: ["ten", "five", "three", "one", "zero", "idk"],
    },
    follow: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    reason: { type: String },
    theresource: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
    oath: {
      type: String,
      enum: ["no", "yes", "maybe", "idk", "other"],
    },
  },
  { timestamps: true } // Moved timestamps here
);

export default mongoose.model("Register", RegisterSchema);
