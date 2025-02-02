import Exam from "../models/examlistModel.js";
import { parseISO } from "date-fns";
import StudentTheoryScore from "../models/theoryModel.js";
import User from "../models/userModel.js";
import classModel from "../models/classModel.js";
import Subject from "../models/subModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
// Create a new exam

// export const createExam = async (req, res) => {
//   try {
//     const { date } = req.body;
//     const exam = new Exam({
//       ...req.body,
//       date: parseISO(date),
//     });
//     const createdExam = await exam.save();
//     res.status(201).json(createdExam);
//   } catch {
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the exam." });
//   }
// };
export const createExam = async (req, res) => {
  try {
    const { date, sessionId } = req.body; // Get sessionId from request body

    // Validate sessionId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const exam = new Exam({
      ...req.body,
      date: parseISO(date),
      session: sessionId, // Save the session ID in the exam document
    });

    const createdExam = await exam.save();

    res.status(201).json(createdExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the exam." });
  }
};

export const editExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const updateData = req.body;

    // Find the exam by ID and update it
    const updatedExam = await Exam.findByIdAndUpdate(examId, updateData, {
      new: true,
    });

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(updatedExam);
  } catch {
    res.status(500).json({ error: "An error occurred while editing the exam" });
  }
};

// Get a list of all exams
// export const getAllExams = async (req, res) => {
//   try {
//     const exams = await Exam.find();
//     res.status(200).json(exams);
//   } catch {
//     res.status(500).json({ error: "An error occurred while fetching exams." });
//   }
// };
// export const getAllExams = async (req, res) => {
//   const { sessionId } = req.params; // Extract the session ID from the route parameters

//   try {
//     // Convert sessionId to ObjectId if needed
//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     // Find all exams with the specified session ID
//     const exams = await Exam.find({ session: sessionObjectId }).exec();

//     if (exams.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No exams found for the specified session" });
//     }

//     res.status(200).json(exams);
//   } catch (err) {
//     console.error("Error fetching exams:", err);
//     res.status(500).json({ error: "An error occurred while fetching exams." });
//   }
// };
export const getAllExams = async (req, res) => {
  const { sessionId } = req.params;

  console.log("Session ID:", sessionId);

  try {
    const exams = await Exam.find({ session: sessionId }).exec();

    console.log("Found Exams:", exams);

    if (exams.length === 0) {
      return res
        .status(404)
        .json({ error: "No exams found for the specified session" });
    }

    res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ error: "An error occurred while fetching exams." });
  }
};

// Get a specific exam by ID
export const getExamById = async (req, res) => {
  const { id, sessionId } = req.params;

  try {
    // Ensure id and sessionId are ObjectId types
    const exam = await Exam.findOne({
      _id: mongoose.Types.ObjectId(id),
      session: mongoose.Types.ObjectId(sessionId),
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the exam." });
  }
};

// Update an existing exam by ID
// export const updateExam = async (req, res) => {
//   try {
//     const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updatedExam) {
//       return res.status(404).json({ error: "Exam not found" });
//     }
//     res.status(200).json(updatedExam);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the exam." });
//   }
// };

// Delete an exam by ID
export const deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndRemove(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the exam." });
  }
};

// examlistController.js
// ... other imports ...

// Function to get exams by class
export const getExamsByClass = async (req, res) => {
  try {
    const classId = req.params.classId; // Get the class identifier from the request parameters
    const sessionId = req.params.sessionId; // Get the class identifier from the request parameters

    // Use a database query to fetch exams by class
    const exams = await Exam.find({ className: classId, session: sessionId }); // Assuming your schema field for class is 'className'

    // Return the filtered exams as a response
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific exam for a specific student by IDs
export const getExamForStudent = async (req, res) => {
  try {
    const { examId, studentId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const studentAnswer = exam.submittedAnswers.find(
      (answer) => String(answer.userId) === studentId
    );

    if (!studentAnswer) {
      return res.status(404).json({ error: "Student answer not found" });
    }

    res.status(200).json({ exam, studentAnswer });
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the exam." });
  }
};

// export const getTheoryAnswer = async (req, res) => {
//   try {
//     const { className, studentId, subjectId } = req.params;
//     console.log("className:", className);
//     console.log("studentId:", studentId);
//     console.log("subjectId:", subjectId);

//     // Find the exam based on className and subject
//     const exam = await Exam.findOne({ className, subject: subjectId });
//     console.log("exam:", exam);
//     if (!exam) {
//       return res.status(404).json({ error: "Exam not found" });
//     }

//     // Find the theory answer for the specified studentId
//     const theoryAnswer = exam.submittedAnswers.find(
//       (answer) => String(answer.userId) === studentId
//     );

//     if (!theoryAnswer) {
//       return res.status(404).json({ error: "Theory answer not found" });
//     }

//     // Return the theory answer
//     res.status(200).json({ theoryAnswer });
//   } catch (error) {
//     console.error("Error fetching theory answer:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the theory answer" });
//   }
// };

export const getTheoryAnswer = async (req, res) => {
  try {
    const { className, studentId, subject } = req.params;
    console.log("className:", className);
    console.log("studentId:", studentId);
    console.log("subject:", subject);
    // Find the exam based on className and subject
    const exam = await Exam.findOne({ className, subject });
    console.log("where is the exam", exam);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Find the theory answer for the specified studentId
    const theoryAnswer = exam.submittedAnswers.find(
      (answer) => String(answer.userId) === studentId
    );

    if (!theoryAnswer) {
      return res.status(404).json({ error: "Theory answer not found" });
    }

    // Return the theory answer
    res.status(200).json({ theoryAnswer });
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the theory answer" });
  }
};
export const getTheoryAnswerByName = async (req, res) => {
  try {
    const { className, studentName, subject } = req.params;
    console.log("className:", className);
    console.log("studentName:", studentName);
    console.log("subject:", subject);

    // Find the exam based on className and subject
    const exam = await Exam.findOne({ className, subject });
    console.log("Exam:", exam);

    if (!exam) {
      console.log("Exam not found");
      return res.status(404).json({ error: "Exam not found" });
    }

    // Find the student based on the studentName
    const student = await User.findOne({ studentName });
    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the theory answer for the specified studentId (based on studentName)
    const theoryAnswer = exam.submittedAnswers.find(
      (answer) => String(answer.userId) === String(student._id)
    );

    if (!theoryAnswer) {
      console.log("Theory answer not found");
      return res.status(404).json({ error: "Theory answer not found" });
    }

    // Return the theory answer
    console.log("Theory Answer:", theoryAnswer);
    res.status(200).json({ theoryAnswer });
  } catch {
    res.status(500).json({
      error: "An error occurred while fetching the theory answer by name",
    });
  }
};
// export const saveStudentTheoryScore = async (req, res) => {
//   try {
//     // const { examId, studentId, questionNumber, outOfScore, scoreGiven } =
//     //   req.body;
//     const {
//       className,
//       subjectName,
//       studentName,
//       questionNumber,
//       outOfScore,
//       scoreGiven,
//     } = req.body;

//     // Validate request body
//     // if (
//     //   !examId ||
//     //   !studentId ||
//     //   !questionNumber ||
//     //   !outOfScore ||
//     //   !scoreGiven
//     // ) {
//     //   return res.status(400).json({ error: "Missing required fields" });
//     // }

//     if (
//       !className ||
//       !subjectName ||
//       !studentName ||
//       !questionNumber ||
//       !outOfScore ||
//       !scoreGiven
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Create a new student theory score document
//     const studentTheoryScore = new StudentTheoryScore({
//       classId,
//       subjectId,
//       studentId,
//       questionNumber,
//       outOfScore: parseInt(outOfScore),
//       scoreGiven: parseInt(scoreGiven),
//     });

//     // Save the student theory score document to the database
//     await studentTheoryScore.save();

//     // Return a success message
//     res.json({ message: "Student theory score saved successfully" });
//   } catch (error) {
//     console.error("Error saving student theory score:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getClassIdFromClassName = async (className) => {
  try {
    // Query the Class collection to find the class with the provided className
    const foundClass = await classModel.findOne({ name: className });

    // If no class is found, return null or throw an error
    if (!foundClass) {
      throw new Error(`Class with name ${className} not found`);
    }

    // Return the classId of the found class
    return foundClass._id; // Assuming _id is the classId field
  } catch {
    // Handle any errors
  }
};
const getSubjectIdFromSubjectName = async (subjectName) => {
  try {
    // Query the Subject collection to find the subject with the provided subjectName
    const foundSubject = await Subject.findOne({ name: subjectName });

    // If no subject is found, return null or throw an error
    if (!foundSubject) {
      throw new Error(`Subject with name ${subjectName} not found`);
    }

    // Return the subjectId of the found subject
    return foundSubject._id; // Assuming _id is the subjectId field
  } catch {
    // Handle any errors
  }
};
const getStudentIdFromStudentName = async (studentName, res) => {
  try {
    // Query the Student collection to find the student with the provided studentName
    const foundStudent = await User.findOne({ studentName });

    // If no student is found, return null or throw an error
    if (!foundStudent) {
      throw new Error(`Student with name ${studentName} not found`);
    }

    // Return the studentId of the found student
    return foundStudent._id; // Assuming _id is the studentId field
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
// export const saveStudentTheoryScore = async (req, res) => {
//   try {
//     // Destructure the required fields from the request body
//     const {
//       className,
//       subjectName,
//       studentName,
//       questionNumber,
//       outOfScore,
//       scoreGiven,
//     } = req.body;

//     // Check if any required field is missing
//     if (
//       !className ||
//       !subjectName ||
//       !studentName ||
//       !questionNumber ||
//       !outOfScore ||
//       !scoreGiven
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Assuming you have fetched classId and subjectId based on className and subjectName
//     const classId = await getClassIdFromClassName(className); // Implement this function
//     const subjectId = await getSubjectIdFromSubjectName(subjectName); // Implement this function

//     // Assuming you have fetched studentId based on studentName
//     const studentId = await getStudentIdFromStudentName(studentName); // Implement this function

//     // Create a new student theory score document
//     const studentTheoryScore = new StudentTheoryScore({
//       classId,
//       subjectId,
//       studentId,
//       questionNumber,
//       outOfScore: parseInt(outOfScore),
//       scoreGiven: parseInt(scoreGiven),
//     });

//     // Save the student theory score document to the database
//     await studentTheoryScore.save();

//     // Return a success message
//     res.json({ message: "Student theory score saved successfully" });
//   } catch (error) {
//     console.error("Error saving student theory score:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const saveStudentTheoryScore = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const {
      className,
      subjectName,
      studentName,
      questionNumber,
      outOfScore,
      scoreGiven,
    } = req.body;

    // Check if any required field is missing
    if (
      !className ||
      !subjectName ||
      !studentName ||
      !questionNumber ||
      !outOfScore ||
      !scoreGiven
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Assuming you have fetched classId and subjectId based on className and subjectName
    const classId = await getClassIdFromClassName(className); // Implement this function
    const subjectId = await getSubjectIdFromSubjectName(subjectName); // Implement this function

    // Assuming you have fetched studentId based on studentName
    const studentId = await getStudentIdFromStudentName(studentName); // Implement this function

    // Check if a record with the same questionNumber exists for the student
    let existingRecord = await StudentTheoryScore.findOne({
      classId,
      subjectId,
      studentId,
      questionNumber,
    });

    if (existingRecord) {
      // If a record exists, update the outOfScore and scoreGiven fields
      existingRecord.outOfScore = parseInt(outOfScore);
      existingRecord.scoreGiven = parseInt(scoreGiven);
      await existingRecord.save();
    } else {
      // Create a new student theory score document
      const studentTheoryScore = new StudentTheoryScore({
        classId,
        subjectId,
        studentId,
        questionNumber,
        outOfScore: parseInt(outOfScore),
        scoreGiven: parseInt(scoreGiven),
      });

      // Save the student theory score document to the database
      await studentTheoryScore.save();
    }

    // Return a success message
    res.json({ message: "Student theory score saved successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentTheoryScoresByExam = async (req, res) => {
  try {
    const examId = req.params.examId;

    // Find all student theory scores for the given examId
    const studentTheoryScores = await StudentTheoryScore.find({ examId });

    // Return the student theory scores
    res.json({ studentTheoryScores });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getStudentTheoryScoresByExamAndStudent = async (req, res) => {
  try {
    const { examId, studentId } = req.params;

    // Find all the student theory scores for the given examId and studentId
    const studentTheoryScores = await StudentTheoryScore.find({
      examId,
      studentId,
    });

    // If no student theory scores are found, return 404
    if (studentTheoryScores.length === 0) {
      return res.status(404).json({
        error: "No student theory scores found for the given exam and student",
      });
    }

    // Return the student theory scores
    res.json({ studentTheoryScores });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const calculateTotalScore = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find all the student theory scores for the given examId and studentId
    const studentTheoryScores = await StudentTheoryScore.find({
      studentId,
    });

    // If no student theory scores are found, return 404
    if (studentTheoryScores.length === 0) {
      return res.status(404).json({
        error: "No student theory scores found for the given exam and student",
      });
    }

    // Calculate total outOfScore and total scoreGiven
    let totalOutOfScore = 0;
    let totalScoreGiven = 0;
    studentTheoryScores.forEach((score) => {
      totalOutOfScore += score.outOfScore;
      totalScoreGiven += score.scoreGiven;
    });

    // Return the total outOfScore and total scoreGiven
    res.json({ totalOutOfScore, totalScoreGiven });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentTheoryScoresByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find all the student theory scores for the given studentId
    const studentTheoryScores = await StudentTheoryScore.find({
      studentId,
    });

    // If no student theory scores are found, return 404
    if (studentTheoryScores.length === 0) {
      return res.status(404).json({
        error: "No student theory scores found for the given student",
      });
    }

    // Return the student theory scores
    res.json({ studentTheoryScores });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getStudentTheoryScoresByStudentAndClassNameAndSubject = async (
//   req,
//   res
// ) => {
//   try {
//     const { className, studentId, subjectName } = req.params;

//     // Find the classId based on the className
//     const foundClass = await classModel.findOne({ name: className });
//     if (!foundClass) {
//       return res.status(404).json({ error: "Class not found" });
//     }

//     // Find the subjectId based on the subjectName
//     const foundSubject = await Subject.findOne({ name: subjectName });
//     if (!foundSubject) {
//       return res.status(404).json({ error: "Subject not found" });
//     }

//     // Find all the student theory scores for the given studentId, classId, and subjectId
//     const studentTheoryScores = await StudentTheoryScore.find({
//       studentId,
//       classId: foundClass._id,
//       subjectId: foundSubject._id,
//     });

//     // If no student theory scores are found, return 404
//     if (studentTheoryScores.length === 0) {
//       return res.status(404).json({
//         error:
//           "No student theory scores found for the given student, class, and subject",
//       });
//     }

//     // Return the student theory scores
//     res.json({ studentTheoryScores });
//   } catch (error) {
//     console.error("Error getting student theory scores:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const getStudentTheoryScoresByStudentAndClassNameAndSubject = async (
  req,
  res
) => {
  try {
    const { className, studentName, subjectName } = req.params;

    // Find the classId based on the className
    const foundClass = await classModel.findOne({ name: className });
    if (!foundClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Find the subjectId based on the subjectName
    const foundSubject = await Subject.findOne({ name: subjectName });
    if (!foundSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Find the studentId based on the studentName
    const foundStudent = await User.findOne({ studentName });
    if (!foundStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find all the student theory scores for the given studentId, classId, and subjectId
    const studentTheoryScores = await StudentTheoryScore.find({
      studentId: foundStudent._id, // Use the found student's ID
      classId: foundClass._id,
      subjectId: foundSubject._id,
    });

    // If no student theory scores are found, return 404
    if (studentTheoryScores.length === 0) {
      return res.status(404).json({
        error:
          "No student theory scores found for the given student, class, and subject",
      });
    }

    // Return the student theory scores
    res.json({ studentTheoryScores });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const calculateTotalScore = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     // Find all the student theory scores for the given studentId
//     const studentTheoryScores = await StudentTheoryScore.find({
//       studentId,
//     });

//     // If no student theory scores are found, return 404
//     if (studentTheoryScores.length === 0) {
//       return res.status(404).json({
//         error: "No student theory scores found for the given student",
//       });
//     }

//     // Calculate total outOfScore and total scoreGiven
//     let totalOutOfScore = 0;
//     let totalScoreGiven = 0;
//     studentTheoryScores.forEach((score) => {
//       totalOutOfScore += score.outOfScore;
//       totalScoreGiven += score.scoreGiven;
//     });

//     // Save total out of score and total score given to the database
//     const totalScore = new StudentTheoryScore({
//       studentId,
//       questionNumber: "Total", // Or any identifier for the total score
//       outOfScore: totalOutOfScore,
//       scoreGiven: totalScoreGiven,
//     });

//     await totalScore.save();

//     // Return the total outOfScore and total scoreGiven
//     res.json({ totalOutOfScore, totalScoreGiven });
//   } catch (error) {
//     console.error("Error calculating total score:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Function to save total scores
// export const saveTotalScores = async (req, res) => {
//   try {
//     const { studentId, totalOutOfScore, totalScoreGiven } = req.body;

//     // Save the total outOfScore and total scoreGiven for the student
//     // Here you can perform any necessary validation before saving the data
//     // For example, you might want to check if the studentId exists in the database

//     // For demonstration purposes, let's assume the data is valid and save it directly
//     // You can adjust this logic based on your application requirements

//     // Save total scores to the database or perform any other required operations

//     res.status(201).json({ message: "Total scores saved successfully" });
//   } catch (error) {
//     console.error("Error saving total scores:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const addSessionToOnlineExamWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Exam.updateMany(
      { session: { $exists: false } }, // Find users without a session field
      { $set: { session: sessionId } } // Set the session field
    );

    res.status(200).json({
      message: "Users updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
