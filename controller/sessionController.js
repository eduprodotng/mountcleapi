// controllers/sessionController.js
import Session from "../models/sessionModel.js";

// Create a new session
export const createSession = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const session = new Session({ name, startDate, endDate });
    await session.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single session by ID
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isActive } = req.body;

    const session = await Session.findByIdAndUpdate(
      id,
      { name, startDate, endDate, isActive },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session updated successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set the active session
export const setActiveSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all other sessions
    await Session.updateMany({}, { isActive: false });

    // Activate the selected session
    const session = await Session.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res
      .status(200)
      .json({ message: "Session activated successfully", session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
