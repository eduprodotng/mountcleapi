import Register from "../models/Register.js"; // Import your Mongoose model

// Controller function to save or update registration step or all data
export const saveRegistrationStep = async (req, res) => {
  const { currentPage, formData } = req.body; // Get current page and form data

  try {
    // Find the user's existing registration document using a unique identifier (e.g., email)
    let registerEntry = await Register.findOne({ email: formData.email });

    // If no entry exists, create a new one
    if (!registerEntry) {
      registerEntry = new Register({
        ...formData,
      });
    } else {
      // Merge current step's form data with existing entry
      // This way, previous fields won't be lost
      registerEntry = await Register.findByIdAndUpdate(
        registerEntry._id,
        {
          $set: {
            ...registerEntry.toObject(), // Retain existing fields
            ...formData, // Override with new fields from current step
          },
        },
        { new: true }
      );
    }

    // Save the entry (this is optional since findByIdAndUpdate does that already)
    await registerEntry.save();

    // Return the full data of the saved or updated entry
    return res.status(200).json({
      message: "Data saved successfully",
      registerEntry: registerEntry, // Return the full registration data
    });
  } catch (error) {
    return res.status(500).json({ error: "Error saving registration data" });
  }
};
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Register.find(); // Fetch all registrations
    return res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error); // Log the actual error
    return res
      .status(500)
      .json({ error: "Error fetching registrations", details: error.message });
  }
};
