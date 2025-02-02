import PracticePq from "../models/practiceQuestionsModel.js";

// Fetch all practice questions for a particular subject
import pastQuests from "../models/pastQuests.js"; // Import the pastQuests model


// Fetch questions for a subject, returning practice questions if available
export const getQuestions = async (req, res) => {
    try {
      const { subjectName } = req.params;
  
      // First, try to find existing practice questions
      const practiceExam = await PracticePq.findOne({ subjectName });
  
      if (practiceExam) {
        // If practice questions exist, return them
        return res.json(practiceExam);
      }
  
      // If no practice questions exist, fetch from past questions
      const pastQuestions = await pastQuests.findOne({ subjectName });
  
      if (!pastQuestions) {
        return res.status(404).send('Questions not found');
      }
  
      // Optionally, create a new practice exam based on past questions
      const newPracticeExam = new PracticePq({
        subjectName,
        pastQuestionId: pastQuestions._id, // Add the pastQuestionId here
        questions: pastQuestions.subSubjects.flatMap(sub => sub.questions) // Fetch all questions from sub-subjects
      });
  
      await newPracticeExam.save(); // Save the new practice exam to the database
  
      res.json(newPracticeExam); // Return the newly created practice exam
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

 
// Submit answers and calculate score
export const submitPractice = async (req, res) => {
    try {
        const { answers, subjectName, practicePqId } = req.body; // Expects an object with selected answers

        // Fetch the practice exam
        const practicePQ = await PracticePq.findById(practicePqId).populate('pastQuestionId');
        
        if (!practicePQ) {
            return res.status(404).send('Practice exam not found');
        }  

        let score = 0;
        practicePQ.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score++;
            }
        });

        const totalQuestions = practicePQ.questions.length;
        const percentage = (score / totalQuestions) * 100;

        res.json({ score, totalQuestions, percentage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

