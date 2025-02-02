import mongoose from "mongoose";
import Psy from "../models/psyModel.js";
import Exam from "../models/examModel.js";

export const savePsy = async (req, res) => {
  try {
    const { examId, updates } = req.body;
    const sessionId = req.params.sessionId; // Get the class identifier from the request parameters

    console.log("Exam ID:", examId);
    console.log("Updates received:", updates); // Log the received updates

    // Check if updates array is present in the request body
    if (!updates || !Array.isArray(updates)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing updates array" });
    }

    // Fetch existing marks for the specified exam and subject
    const existingMarks = await Psy.findOne({ examId, session: sessionId });

    // If existing marks are not found or the array is empty, proceed to create new marks
    if (!existingMarks || existingMarks.marks.length === 0) {
      // Save marks to the database using the provided examId and subjectId
      const savedMarks = await Psy.create({
        examId,
        session: sessionId,
        marks: await Promise.all(
          updates.map(async (mark) => {
            if (!mark) {
              console.error("Received null mark:", mark); // Log null marks
              return null; // Skip null marks
            }

            const {
              studentId,
              instruction,
              independently,
              punctuality,
              talking,
              eyecontact,
              remarks = "",
              premarks = "",
            } = mark;

            return {
              studentId,
              instruction,
              independently,
              punctuality,
              talking,
              eyecontact,
              remarks,
              premarks,
            };
          })
        ),
      });

      return res.status(201).json({
        message: "Marks saved successfully",
        savedMarks,
      });
    }

    // If existing marks are found, update the marks
    existingMarks.marks.forEach((existingMark) => {
      const update = updates.find(
        (mark) => mark.studentId === existingMark.studentId
      );

      if (update) {
        existingMark.instruction = update.instruction;
        existingMark.independently = update.independently;
        existingMark.punctuality = update.punctuality;
        existingMark.talking = update.talking;
        existingMark.eyecontact = update.eyecontact;
        existingMark.remarks = update.remarks;
        existingMark.premarks = update.premarks;
      }
    });

    await existingMarks.save();

    res.status(200).json({
      message: "Marks updated successfully",
      updatedMarks: existingMarks,
    });
  } catch (error) {
    console.error("Error saving/updating marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMark = async (req, res) => {
  try {
    const { examName } = req.params;

    // Fetch the exam based on the provided examName
    const fetchedExam = await Exam.findOne({ name: examName });

    if (!fetchedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Fetch the marks based on the ObjectId of the fetched exam
    const marks = await Psy.find({ examId: fetchedExam._id });

    if (marks.length === 0) {
      return res.status(404).json({ message: "Marks not found" });
    }

    // Ensure each mark has the subjectId populated
    const scores = marks.map((mark) => ({
      // Make sure subjectId is set in your schema
      ...mark.toObject(),
    }));

    res.status(200).json({ examId: fetchedExam._id, scores });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const userId = req.params.studentId; // Assuming the studentId is passed as a parameter in the URL

//     // Fetch marks for the specified student and populate the necessary fields
//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // Ensure each mark has the examId and subjectId populated
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter((m) => m.studentId.toString() === userId)
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getPsybyStudent = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    const marks = await Psy.find({
      "marks.studentId": studentId,
      session: sessionObjectId,
    }).populate("examId", "name");

    const scores = marks.flatMap((mark) =>
      mark.marks
        .filter(
          (m) =>
            m.studentId.toString() === studentId &&
            (m.testscore !== 0 ||
              m.examscore !== 0 ||
              m.punctuality != 0 ||
              m.talking != 0 ||
              m.eyecontact != 0 ||
              m.remarks != 0) &&
            m.premarks.trim() !== ""
        )
        .map((m) => ({
          examId: mark.examId,

          examName: mark.examId.name,

          instruction: m.instruction,
          independently: m.independently,
          punctuality: m.punctuality,
          talking: m.talking,
          eyecontact: m.eyecontact,
          remarks: m.remarks,
          premarks: m.premarks,

          ...m.toObject(),
        }))
    );

    res.status(200).json({ studentId: studentId, scores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getScores = async (req, res) => {
  try {
    const { examId } = req.params;

    const isExamIdValid = mongoose.isValidObjectId(examId);

    if (!isExamIdValid) {
      return res.status(400).json({
        message: "Invalid ObjectId format for both examId and subjectId",
      });
    }

    const marks = await Psy.findOne({
      examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
    });

    if (!marks) {
      return res.status(200).json({ examId, scores: [] });
    }

    // Populate the studentId field to get the student details
    await Psy.populate(marks, {
      path: "marks.studentId",
      select: "studentName",
    });

    // Extract relevant information for response
    const scores = marks.marks.map((m) => ({
      studentId: m.studentId,
      studentName: m.studentId ? m.studentId.studentName : null,
      instruction: m.instruction,
      independently: m.independently,
      punctuality: m.punctuality,
      talking: m.talking,
      eyecontact: m.eyecontact,
      remarks: m.remarks,
      premarks: m.premarks,
    }));

    res.status(200).json({ examId, scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateMark = async (req, res) => {
  try {
    const {
      examId,
      instruction,
      independently,
      punctuality,
      talking,
      eyecontact,
      remarks,
      premarks,
    } = req.body;
    const studentIdToUpdate = req.params.studentId;

    const result = await Psy.updateOne(
      {
        "marks.studentId": studentIdToUpdate,
        examId,
      },
      {
        $set: {
          "marks.$[elem].instruction": instruction,
          "marks.$[elem].independently": independently,
          "marks.$[elem].punctuality": punctuality,
          "marks.$[elem].talking": talking,
          "marks.$[elem].eyecontact": eyecontact,
          "marks.$[elem].remarks": remarks,
          "marks.$[elem].premarks": premarks,
        },
      },
      {
        arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
      }
    );

    console.log("Update Result:", result);
    console.log("Request Body:", req.body);

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "No matching records found for update" });
    }

    const updatedDocument = await Psy.findOne({
      "marks.studentId": studentIdToUpdate,
      examId,
    });

    res
      .status(200)
      .json({ message: "Marks updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateMarks = async (req, res) => {
  try {
    const { examId, updates } = req.body;

    if (!examId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const results = [];
    const updatedDocuments = [];

    for (const update of updates) {
      const {
        studentId,
        instruction,
        independently,
        punctuality,
        talking,
        eyecontact,
        remarks,
        premarks,
      } = update;

      const filter = {
        examId,
        "marks.studentId": studentId,
      };

      const updateOperation = {
        $set: {
          "marks.$[elem].instruction": instruction,
          "marks.$[elem].independently": independently,
          "marks.$[elem].punctuality": punctuality,
          "marks.$[elem].talking": talking,
          "marks.$[elem].eyecontact": eyecontact,
          "marks.$[elem].remarks": remarks,
          "marks.$[elem].premarks": premarks,
        },
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true,
      };

      let updatedDoc = await Psy.findOneAndUpdate(
        filter,
        updateOperation,
        options
      );

      if (!updatedDoc) {
        // If the document doesn't exist, create a new mark
        const newMark = {
          studentId,
          instruction,
          independently,
          punctuality,
          talking,
          eyecontact,
          remarks,
          premarks,
        };

        const filter = { examId };
        const update = { $push: { marks: newMark } };
        const options = { upsert: true, new: true };

        updatedDoc = await Psy.findOneAndUpdate(filter, update, options);
      }

      updatedDocuments.push(updatedDoc);

      results.push({
        studentId,
        success: true,
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      results,
      updatedDocuments,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
