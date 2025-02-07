import Finger from "../models/Finger.js"; // Import your Mongoose model

export const saveFingerStep = async (req, res) => {
  const { currentPage, formData } = req.body; // Get current page and form data

  console.log("Received data:", { currentPage, formData }); // Log incoming data

  try {
    // Find the user's existing registration document using a unique identifier (e.g., email)
    let registerEntry = await Finger.findOne({ email: formData.email });

    console.log("Existing entry:", registerEntry); // Log if an existing entry is found

    // If no entry exists, create a new one
    if (!registerEntry) {
      registerEntry = new Finger({
        ...formData, // Change Register to Finger (Fix error)
      });

      console.log("New entry created:", registerEntry);
    } else {
      // Merge current step's form data with existing entry
      registerEntry = await Finger.findByIdAndUpdate(
        registerEntry._id,
        {
          $set: {
            ...registerEntry.toObject(), // Retain existing fields
            ...formData, // Override with new fields from current step
          },
        },
        { new: true }
      );

      console.log("Updated entry:", registerEntry);
    }

    // Save the entry (this is optional since findByIdAndUpdate does that already)
    await registerEntry.save();

    console.log("Entry saved successfully");

    // Return the full data of the saved or updated entry
    return res.status(200).json({
      message: "Data saved successfully",
      registerEntry: registerEntry, // Return the full registration data
    });
  } catch (error) {
    console.error("Error saving registration data:", error); // Log error to console
    return res.status(500).json({
      error: "Error saving registration data",
      details: error.message,
    });
  }
};
export const getAllFingers = async (req, res) => {
  try {
    const fingers = await Finger.find(); // Fetch all documents from the database
    return res.status(200).json(fingers); // Send the retrieved data as a response
  } catch (error) {
    console.error("Error fetching finger data:", error);
    return res.status(500).json({ error: "Failed to retrieve data" });
  }
};
