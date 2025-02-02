import ExamQuestion from "../models/examQuestionModel.js";
import { generateQuestions } from "../services/questionService.js";
import { callOpenAI } from "../services/openaiService.js";
import { generateLessonNoteContent } from "../services/lessonNoteService.js";

import { generateFieldsFromOpenAI } from "../services/generateFieldService.js";

import GenerateField from "../models/GenerateField.js";
import LessonNote from "../models/lessonNoteModel.js";
import GenQuestion from "../models/GenQuestionModel.js";
import { generateGenQuestions } from "../services/generateGenService.js";
export const generateQuestion = async (req, res) => {
  const {
    title,
    className,
    topic,
    difficulty,
    numberOfQuestions,
    date,
    subject,
    fromTime,
    toTime,
    percent,
    instruction,
    session,
    preview, // Add preview flag
  } = req.body;

  try {
    // Generate questions using the generateQuestions function
    const generatedQuestions = await generateQuestions(
      topic,
      difficulty,
      numberOfQuestions
    );

    if (generatedQuestions && generatedQuestions.length > 0) {
      if (preview) {
        // Return the generated questions for preview without saving
        return res.status(200).json({
          message: "Preview generated successfully",
          questions: generatedQuestions,
        });
      } else {
        // Proceed with creating a new ExamQuestion document if preview is not requested
        const examQuestion = new ExamQuestion({
          title,
          className,
          topic,
          difficulty,
          date,
          subject,
          fromTime,
          toTime,
          percent,
          instruction,
          session,
          questions: generatedQuestions.map((q) => ({
            questionText: q.questionText || q,
            questionType: q.questionType || "short-answer",
            options: q.options || [],
            correctAnswer: q.correctAnswer || "",
          })),
          createdBy: req.user._id,
        });

        // Save the exam questions to the database
        await examQuestion.save();

        // Respond with the created exam question document
        res.status(201).json({
          message: "Exam questions generated and saved successfully",
          examQuestion,
        });
      }
    } else {
      res.status(400).json({ error: "No questions generated" });
    }
  } catch (error) {
    console.error("Error in generateQuestion:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating questions" });
  }
};

// import { generateLessonNote } from "../services/lessonNoteService.js";

// export const generateLessonNoteHandler = async (req, res) => {
//   const { topic, className, subject } = req.body;

//   try {
//     // Generate lesson note using a service
//     const lessonNote = await generateLessonNot(topic, className, subject);

//     if (lessonNote) {
//       res.status(200).json({
//         message: "Lesson note generated successfully",
//         lessonNote,
//       });
//     } else {
//       res.status(400).json({ error: "No lesson note generated" });
//     }
//   } catch (error) {
//     console.error("Error in generateLessonNoteHandler:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating the lesson note" });
//   }
// };

export const generateLessonNote = async (req, res) => {
  const {
    topic,
    className,
    subject,
    date,
    session,
    preview, // Add preview flag
  } = req.body;

  try {
    // Generate the lesson note content using the service
    const lessonNoteContent = await generateLessonNoteContent(
      topic,
      className,
      subject
    );

    if (!lessonNoteContent) {
      return res
        .status(400)
        .json({ error: "No lesson note content generated" });
    }

    if (preview) {
      // Return the generated content for preview without saving
      return res.status(200).json({
        message: "Preview generated successfully",
        lessonNoteContent,
      });
    }

    // Create a new LessonNote document if preview is not requested
    const lessonNote = new LessonNote({
      topic,
      className,
      subject,
      date,
      session,
      content: lessonNoteContent,
      createdBy: req.user._id,
    });

    // Save the lesson note to the database
    await lessonNote.save();

    res.status(201).json({
      message: "Lesson note generated and saved successfully",
      lessonNote,
    });
  } catch (error) {
    console.error("Error in generateLessonNote:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the lesson note" });
  }
};

// Add this to your backend routes

// export const generateTopic = async (req, res) => {
//   const { subject } = req.body;

//   if (!subject) {
//     return res.status(400).json({ error: "Subject is required" });
//   }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: `Generate a list of 10 detailed topics for the subject: ${subject}.
//           Ensure the topics are diverse and relevant to a standard curriculum.`,
//         },
//       ],
//       max_tokens: 300,
//       temperature: 0.7,
//     });

//     const topics = response.choices[0].message.content
//       .split("\n")
//       .filter((topic) => topic.trim() !== ""); // Clean up the topics

//     res.status(200).json({ topics });
//   } catch (error) {
//     console.error("Error generating topics:", error);
//     res.status(500).json({ error: "Failed to generate topics" });
//   }
// };

export const generateTopic = async (req, res) => {
  const { subject } = req.body;

  if (!subject) {
    return res.status(400).json({ error: "Subject is required" });
  }

  const messages = [
    {
      role: "user",

      content: `Generate a list of 30 concise topics for the subject "${subject}" that are brief (1–2 words) and suitable for standard curriculum discussions. Do not include explanations or long descriptions—just the topic names.`,
    },
  ];

  try {
    const response = await callOpenAI(messages, 300, 0.7);

    const topics = response.split("\n").filter((topic) => topic.trim() !== ""); // Clean up the topics

    res.status(200).json({ topics });
  } catch (error) {
    console.error("Error generating topics:", error);
    res.status(500).json({ error: "Failed to generate topics" });
  }
};

export const generateFieldTopic = async (req, res) => {
  const { field } = req.body; // Accept the field

  if (!field) {
    return res.status(400).json({ error: "Field is required" }); // Error if no field provided
  }

  const messages = [
    {
      role: "user",
      content: `Generate a list of 40 concise, general topics for the field "${field}". Each topic should be 1-2 words long and should cover broad concepts in that field, not specific technologies or terms. For example, in the tech field, generate topics like 'Software Development', 'Cloud Computing', 'Artificial Intelligence', etc., instead of individual programming languages or tools.`,
    },
  ];

  try {
    const response = await callOpenAI(messages, 300, 0.7);

    const topics = response.split("\n").filter((topic) => topic.trim() !== ""); // Clean up the topics

    res.status(200).json({ topics });
  } catch (error) {
    console.error("Error generating topics:", error);
    res.status(500).json({ error: "Failed to generate topics" });
  }
};

// Generate and save fields
export const generateAllFields = async (req, res) => {
  try {
    // Generate fields using the OpenAI service
    const fields = await generateFieldsFromOpenAI();

    if (!fields || fields.length === 0) {
      return res
        .status(400)
        .json({ message: "No fields generated by OpenAI." });
    }

    // Save each field to the database
    const savedFields = await Promise.all(
      fields.map((field) =>
        GenerateField.create({
          type: "field",
          content: field, // Save the field content
          createdBy: req.user ? req.user._id : null, // Optional user association
        })
      )
    );

    res.status(201).json({
      message: "Fields generated and saved successfully",
      data: savedFields,
    });
  } catch (error) {
    console.error("Error generating fields:", error.message);
    res
      .status(500)
      .json({ message: "Error generating fields", error: error.message });
  }
};

// Retrieve all saved fields
export const getAllSavedFields = async (req, res) => {
  try {
    const fields = await GenerateField.find({ type: "field" }); // Fetch fields
    res.status(200).json({
      message: "Fields retrieved successfully",
      data: fields,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving fields",
      error: error.message,
    });
  }
};

// export const generateGeneralQuestion = async (req, res) => {
//   const {
//     fullname,
//     email,
//     topic,
//     difficulty,
//     numberOfQuestions,

//     field,

//     preview, // Add preview flag
//   } = req.body;

//   try {
//     // Generate questions using the generateQuestions function
//     const generatedQuestions = await generateFieldsFromOpenAI(
//       topic,
//       difficulty,
//       numberOfQuestions
//     );

//     if (generatedQuestions && generatedQuestions.length > 0) {
//       if (preview) {
//         // Return the generated questions for preview without saving
//         return res.status(200).json({
//           message: "Preview generated successfully",
//           questions: generatedQuestions,
//         });
//       } else {
//         // Proceed with creating a new ExamQuestion document if preview is not requested
//         const examQuestion = new GenQuestion({
//           fullname,
//           email,
//           topic,
//           difficulty,
//           numberOfQuestions,

//           field,

//           preview,
//           questions: generatedQuestions.map((q) => ({
//             questionText: q.questionText || q,
//             questionType: q.questionType || "short-answer",
//             options: q.options || [],
//             correctAnswer: q.correctAnswer || "",
//           })),
//           createdBy: req.user._id,
//         });

//         // Save the exam questions to the database
//         await examQuestion.save();

//         // Respond with the created exam question document
//         res.status(201).json({
//           message: "Exam questions generated and saved successfully",
//           examQuestion,
//         });
//       }
//     } else {
//       res.status(400).json({ error: "No questions generated" });
//     }
//   } catch (error) {
//     console.error("Error in generateQuestion:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating questions" });
//   }
// };

export const generateGeneralQuestion = async (req, res) => {
  const {
    fullname,
    email,
    topic,
    difficulty,
    numberOfQuestions,
    field,
    preview, // Add preview flag
  } = req.body;

  console.log("Request Body:", req.body); // Debugging log

  try {
    const generatedQuestions = await generateGenQuestions(
      topic,
      difficulty,
      numberOfQuestions
    );

    if (generatedQuestions && generatedQuestions.length > 0) {
      if (preview) {
        return res.status(200).json({
          message: "Preview generated successfully",
          questions: generatedQuestions,
        });
      } else {
        const examQuestion = new GenQuestion({
          fullname,
          email,
          topic,
          difficulty,
          numberOfQuestions,
          field,
          preview,
          questions: generatedQuestions.map((q) => ({
            questionText: q.questionText || q,
            questionType: q.questionType || "short-answer",
            options: q.options || [],
            correctAnswer: q.correctAnswer || "",
          })),
        });

        await examQuestion.save();

        res.status(201).json({
          message: "Exam questions generated and saved successfully",
          examQuestion,
        });
      }
    } else {
      res.status(400).json({ error: "No questions generated" });
    }
  } catch (error) {
    console.error("Error in generateQuestion:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating questions" });
  }
};
