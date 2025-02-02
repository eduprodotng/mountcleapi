// noticeController.js
import Notice from "../models/noticeModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
export const createNotice = async (req, res) => {
  const { date, notice, posted_by, sessionId } = req.body;

  try {
    // Validate session ID
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Create a new notice with the session association
    const newNotice = new Notice({
      date,
      notice,
      posted_by,
      session: sessionId, // Associate with the session
    });

    const savedNotice = await newNotice.save();

    res.status(201).json(savedNotice);
  } catch (error) {
    console.error("Failed to create notice:", error);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

export const getNotice = async (req, res) => {
  const role = req.params.role;

  try {
    // Find notices based on their posted_by role
    const notices = await Notice.find({ posted_by: role }).exec();

    if (!notices) {
      return res.status(404).json({ error: "No notices found for that role" });
    }

    return res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get notices" });
  }
};

// export const getallNotice = async (req, res) => {
//   try {
//     // Find all notices
//     const notices = await Notice.find({}).exec();

//     if (!notices) {
//       return res.status(404).json({ error: "No notices found" });
//     }

//     return res.status(200).json(notices);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to get notices" });
//   }
// };
export const getallNotice = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Convert sessionId to ObjectId if needed
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find all notices for the given session
    const notices = await Notice.find({ session: sessionObjectId }).exec();

    if (!notices || notices.length === 0) {
      return res
        .status(404)
        .json({ error: "No notices found for the specified session" });
    }

    return res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({ error: "Failed to get notices" });
  }
};

export const deleteNotice = async (req, res) => {
  const noticeId = req.params.id;

  try {
    const deletedNotice = await Notice.findByIdAndDelete(noticeId);

    if (!deletedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res
      .status(200)
      .json({ message: "Notice deleted successfully", deletedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

export const editNotice = async (req, res) => {
  const { id } = req.params;
  const { date, notice, posted_by } = req.body;

  try {
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { date, notice, posted_by },
      { new: true } // This option returns the updated document
    );

    if (!updatedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.status(200).json(updatedNotice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update notice" });
  }
};

export const getNoticebyId = async (req, res) => {
  const noticeId = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error);
    res.status(500).json({ error: "Failed to fetch notice" });
  }
};

export const addSessionToNoticeWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Notice.updateMany(
      { session: { $exists: false } }, // Find users without a session field
      { $set: { session: sessionId } } // Set the session field
    );

    res.status(200).json({
      message: "Notice updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
