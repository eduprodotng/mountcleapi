import mongoose from 'mongoose';

// Define the schema for the practice question
const practicePqSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    pastQuestionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PathQuestion', // Reference to past questions
        required: true 
    },
    questions: [
      {
        title: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true }
      }
    ]
});

// Export the model in ES module format
export default mongoose.model('PracticePq', practicePqSchema);
