import mongoose from "mongoose";

const PathQuestionSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,  // E.g., Social Studies
    },
    class: { // New field added here
        type: String,
        required: true,  // E.g., Class 5
      },
    subSubjects: [
      {
        title: { 
          type: String, 
          required: true  // E.g., NECO, JAMB
        },
        questions: [
          {
            title: { 
              type: String, 
              required: true  // The question title
            },
            options: [
              {
                type: String,  // Array of options
                required: true,
              }
            ],
            correctAnswer: { 
              type: String, 
              required: true  // The correct answer
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("PathQuestion", PathQuestionSchema);
