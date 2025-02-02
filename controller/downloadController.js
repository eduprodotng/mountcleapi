import Download from "../models/downloadModel.js";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
import AWS from "aws-sdk";

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key from environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Key from environment variables
  region: "us-east-1", // AWS Region
});

// Create an S3 instance
const s3 = new AWS.S3();
export const createDownload = async (req, res) => {
  try {
    const { date, title, desc, className, subject, session } = req.body;

    console.log("Request Body:", req.body);
    console.log("Request File:", req.file); // Check the file details

    // Check if file was uploaded
    if (!req.file || !req.file.location) {
      console.log("File was not uploaded correctly", req.file);
      console.log("File uploaded to S3 at:", req.file.location);

      return res
        .status(400)
        .json({ success: false, message: "File is required" });
    }

    // Convert sessionId to ObjectId if necessary
    const sessionObjectId = mongoose.Types.ObjectId(session);
    const sessionData = await Session.findById(sessionObjectId);
    if (!sessionData) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Create a new instance of the Download model
    const newDownload = new Download({
      date,
      title,
      desc,
      className,
      subject,
      session: sessionObjectId, // Associate with the session
      Downloads: req.file.location, // Store the S3 file URL
    });

    // Save the new Download document
    const savedDownload = await newDownload.save();
    console.log("Saved Download:", savedDownload);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "File uploaded and download created successfully",
      data: savedDownload,
    });
  } catch (error) {
    console.error("Error creating download:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getDownload = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Convert sessionId to ObjectId if necessary
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find all downloads for the specified session
    const schoolSetting = await Download.find({
      session: sessionObjectId,
    }).exec();

    if (!schoolSetting || schoolSetting.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Download not found for the specified session",
      });
    }

    res.status(200).json({ success: true, data: schoolSetting });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getDownloadbyClass = async (req, res) => {
  try {
    const { sessionId, className } = req.params; // Extract sessionId and className from URL parameters

    // Find downloads that match both sessionId and className
    const downloads = await Download.find({
      session: mongoose.Types.ObjectId(sessionId), // Ensure sessionId is in ObjectId format
      className: className, // Match className as well
    });

    if (!downloads || downloads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No downloads found for the specified session and class",
      });
    }

    return res.status(200).json({
      success: true,
      data: downloads,
    });
  } catch (error) {
    console.error("Error retrieving downloads:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// export const deleteDownload = async (req, res) => {
//   const { sessionId, downloadId } = req.params;

//   try {
//     // Find the download document by ID
//     const download = await Download.findById(downloadId);

//     if (!download) {
//       return res.status(404).json({
//         success: false,
//         message: "Download not found",
//       });
//     }

//     // Check if the session ID matches
//     if (!download.session.equals(mongoose.Types.ObjectId(sessionId))) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to delete this download",
//       });
//     }

//     // Delete the file from S3
//     const deleteParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME, // Replace with your S3 bucket name
//       Key: download.Downloads.split("/").pop(), // Extract the filename from the S3 URL
//     };

//     await s3.deleteObject(deleteParams).promise();

//     // Delete the download record from the database
//     await Download.findByIdAndDelete(downloadId);

//     return res.status(200).json({
//       success: true,
//       message: "Download deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting download:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const deleteDownload = async (req, res) => {
  const { sessionId, downloadId } = req.params;

  try {
    // Find the download document by ID
    const download = await Download.findById(downloadId);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    // Check if the session ID matches
    if (!download.session.equals(mongoose.Types.ObjectId(sessionId))) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this download",
      });
    }

    // Delete the download record from the database
    await Download.findByIdAndDelete(downloadId);

    return res.status(200).json({
      success: true,
      message: "Download deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting download:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
