// import multer from "multer"; // Import Multer for handling file uploads
// import XLSX from "xlsx"; // Import the XLSX library for reading Excel files
// import pastQuests from "../models/pastQuests.js"; // Import the pastQuests model
// import PracticePq from "../models/practiceQuestionsModel.js";

// const upload = multer({ dest: "uploads/" }); // Configure Multer to save uploaded files in the 'uploads/' directory

// // Controller function for uploading and processing the Excel file
// export const addPastQuestions = async (req, res) => {
//   try {
//     const file = req.file; // Get the uploaded file from the request

//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     // Use XLSX to read the file
//     const workbook = XLSX.readFile(file.path);
//     const sheet_name_list = workbook.SheetNames;
//     const jsonData = XLSX.utils.sheet_to_json(
//       workbook.Sheets[sheet_name_list[0]]
//     );

//     // Transform the data into the format expected by your MongoDB model
//     const subjects = {}; // Store subjects and their sub-subjects

//     // Collect existing records for comparison
//     const existingQuestions = await pastQuests.find().lean();

//     // Create a lookup table for existing data
//     const existingLookup = {};
//     existingQuestions.forEach((subject) => {
//       subject.subSubjects.forEach((sub) => {
//         sub.questions.forEach((question) => {
//           existingLookup[
//             `${subject.subjectName}_${sub.title}_${question.title}`
//           ] = true;
//         });
//       });
//     });

//     // Iterate over each row in the Excel file
//     jsonData.forEach((row) => {
//       const {
//         subjectName,
//         class: className,
//         subSubjectTitle,
//         questionTitle,
//         options,
//         correctAnswer,
//       } = row;

//       // Skip duplicates based on subject, sub-subject, and question title
//       const questionKey = `${subjectName}_${subSubjectTitle}_${questionTitle}`;
//       if (existingLookup[questionKey]) {
//         console.log(`Duplicate question skipped: ${questionKey}`);
//         return; // Skip if question already exists
//       }

//       // Initialize the subject if it doesn't exist
//       if (!subjects[subjectName]) {
//         subjects[subjectName] = {
//           subjectName,
//           class: className,
//           subSubjects: [],
//         };
//       }

//       // Find the sub-subject if it exists, otherwise create it
//       let subSubject = subjects[subjectName].subSubjects.find(
//         (sub) => sub.title === subSubjectTitle
//       );
//       if (!subSubject) {
//         subSubject = { title: subSubjectTitle, questions: [] };
//         subjects[subjectName].subSubjects.push(subSubject); // Add the sub-subject
//       }

//       // Add the question to the sub-subject (make sure to avoid duplicates within the current file)
//       subSubject.questions.push({
//         title: questionTitle,
//         options: options.split(",").map((opt) => opt.trim()), // Split and trim options
//         correctAnswer: String(correctAnswer).trim(), // Ensure correctAnswer is treated as a string
//       });
//     });

//     // Convert subjects object into an array for bulk insertion
//     const subjectsArray = Object.values(subjects);

//     // Insert new data into MongoDB
//     for (const subject of subjectsArray) {
//       const existingSubject = await pastQuests.findOne({
//         subjectName: subject.subjectName,
//         class: subject.class,
//       });

//       if (existingSubject) {
//         // Merge new sub-subjects and questions into the existing subject
//         subject.subSubjects.forEach((newSubSubject) => {
//           const existingSubSubject = existingSubject.subSubjects.find(
//             (sub) => sub.title === newSubSubject.title
//           );

//           if (existingSubSubject) {
//             // Merge questions into the existing sub-subject
//             newSubSubject.questions.forEach((newQuestion) => {
//               const questionExists = existingSubSubject.questions.some(
//                 (question) => question.title === newQuestion.title
//               );

//               if (!questionExists) {
//                 existingSubSubject.questions.push(newQuestion); // Add new question
//               }
//             });
//           } else {
//             existingSubject.subSubjects.push(newSubSubject); // Add new sub-subject
//           }
//         });

//         // Update the existing subject in the database
//         await pastQuests.updateOne(
//           { _id: existingSubject._id },
//           existingSubject
//         );
//       } else {
//         // Insert new subject if it doesn't exist
//         await pastQuests.create(subject);
//       }
//     }

//     res.send("Data successfully uploaded and inserted into the database!");
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error processing the file");
//   }
// };

// // Fetch all subjects from the PathQuestion model
// export const getSubjects = async (req, res) => {
//   try {
//     const subjects = await pastQuests.find({}, "subjectName");
//     res.json(subjects);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// // Create a practice exam based on past questions
// export const createPracticeExam = async (req, res) => {
//   try {
//     const { subjectName, pastQuestionId } = req.body;

//     // Fetch the past questions based on the subject and pastQuestionId
//     const pastQuestion = await pastQuests.findById(pastQuestionId);

//     if (!pastQuestion) {
//       return res.status(404).send("Past Question was not found");
//     }

//     // Create a new practice exam from past questions
//     const practiceExam = new PracticePq({
//       subjectName,
//       pastQuestionId,
//       questions: pastQuestion.subSubjects.flatMap((sub) => sub.questions), // Use the questions from past questions
//     });

//     await practiceExam.save();
//     res.status(201).json(practiceExam);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// };

// // Controller function to view past questions
// export const viewPastQuests = async (req, res) => {
//   try {
//     const questions = await pastQuests.find(); // Retrieve all past questions from the database
//     res.json(questions); // Return the questions in JSON format
//   } catch (error) {
//     console.error("Error:", error); // Log the error
//     res.status(500).send("Error retrieving questions"); // Send a 500 response if an error occurs
//   }
// };
