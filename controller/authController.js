/* global process */

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";
import Setting from "../models/settingModel.js";
import Account from "../models/accountModel.js";
import bcrypt from "bcryptjs";
import Download from "../models/downloadModel.js";
import Subject from "../models/subModel.js";
import Exam from "../models/examModel.js";
// export const register = async (req, res) => {
//   try {
//     const { role, ...userData } = req.body; // Capture role and user data

//     if (!["admin", "teacher", "parent", "student"].includes(role)) {
//       return res.status(400).json({ error: "Invalid role" });
//     }
//     const hashedPassword = await bcrypt.hash(userData.password, 10);

//     // const user = new User({ role, ...userData });
//     const user = new User({ role, ...userData, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ user, role: user.role }, process.env.JWT_SECRET);

//     return res.status(201).json({ token, user });
//   } catch {
//     return res.status(500).json({ error: "Registration failed" });
//   }
// };
export const register = async (req, res) => {
  try {
    const { role, sessionId, ...userData } = req.body; // Capture session ID
    const { email, username, password } = userData;
    console.log("Received registration data:", { role, sessionId, userData });

    if (!["admin", "teacher", "parent", "student"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).exec();

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already exists" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      role,
      ...userData,
      password: hashedPassword,
      session: sessionId, // Associate with the session
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
};
// export const getUserByRole = async (req, res) => {
//   const role = req.params.role;

//   try {
//     // Find users based on their role
//     const users = await User.find({ role: role }).exec();

//     if (!users) {
//       return res.status(404).json({ error: "No users found with that role" });
//     }

//     return res.status(200).json(users);
//   } catch {
//     return res.status(500).json({ error: "Failed to get users" });
//   }
// };
export const getUserByRole = async (req, res) => {
  const { role, sessionId } = req.params;

  try {
    // Convert sessionId to ObjectId
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Find users based on their role and session
    const users = await User.find({
      role: role,
      session: sessionObjectId, // Add session filter here
    }).exec();

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: "No users found with that role and session" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to get users" });
  }
};
// ...
// export const login = async (req, res) => {
//   const { identifier, password } = req.body;

//   try {
//     // Find the user by email or username
//     const user = await User.findOne({
//       $or: [{ email: identifier }, { username: identifier }],
//     }).exec();

//     console.log("User found:", user);

//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const role = user.role;

//     // const token = jwt.sign({ user, role }, process.env.JWT_SECRET);
//     const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(200).json({ token, user });
//   } catch {
//     return res.status(500).json({ error: "Login failed" });
//   }
// };

// export const login = async (req, res) => {
//   const { identifier, password } = req.body;

//   try {
//     // Find the user by email or username
//     const user = await User.findOne({
//       $or: [{ email: identifier }, { username: identifier }],
//     }).exec();

//     console.log("User found:", user);

//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Compare provided password with hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       console.log("Invalid password");
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const role = user.role;

//     // Generate a token if the password is correct
//     const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(200).json({ token, user });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ error: "Login failed" });
//   }
// };

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).exec();

    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Log the provided password and the stored hashed password
    console.log("Password provided by user:", password);
    console.log("Stored hashed password for user:", user.password);

    // Compare provided password with hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password); // Using compareSync for logging consistency
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", identifier);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const role = user.role;

    // Generate a token if the password is correct
    const token = jwt.sign({ user, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

export const updatePasswords = async (req, res) => {
  try {
    // Find all users with empty passwords
    const usersToUpdate = await User.find({ password: "" });

    if (usersToUpdate.length === 0) {
      return res
        .status(200)
        .json({ message: "No users found with empty passwords." });
    }

    // Update each user with a new hashed password
    for (const user of usersToUpdate) {
      const newPassword = "hlhs12345"; // Set this to a desired default password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    }

    console.log("Password updates completed.");
    res.status(200).json({
      message: "Password updates completed.",
      updatedUsersCount: usersToUpdate.length,
    });
  } catch (error) {
    console.error("Error updating passwords:", error);
    res.status(500).json({ error: "Error updating passwords." });
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};
// export const getAdmin = async (req, res) => {
//   try {
//     // Verify the user role (only "admin" can get teachers)
//     const teachers = await User.find({ role: "admin" });
//     res.status(200).json(teachers);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// export const getAdmin = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     // Convert sessionId to ObjectId
//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     // Fetch admins for the specified session
//     const admins = await User.find({
//       role: "admin",
//       session: sessionObjectId, // Add session filter here
//     })
//       .select("username email address phone _id") // Adjust fields as needed
//       .exec();

//     if (admins.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No admins found for that session" });
//     }

//     return res.status(200).json(admins);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     return res.status(500).json({ error: "Failed to get admins" });
//   }

// export const getAdmin = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     // Fetch admins for the specified session
//     const admins = await User.find({
//       role: "admin",
//       session: sessionObjectId, // Remove ObjectId conversion if session is stored as a string
//     })
//       .select("username email address phone _id") // Adjust fields as needed
//       .exec();

//     if (admins.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No admins found for that session" });
//     }

//     return res.status(200).json(admins);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     return res.status(500).json({ error: "Failed to get admins" });
//   }
// };
export const getAdmin = async (req, res) => {
  const { sessionId } = req.params; // Extract sessionId from the URL parameters

  try {
    // Convert the sessionId to an ObjectId if necessary (depending on how it's stored in the database)
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Fetch admins for the specified session
    const admins = await User.find({
      role: "admin",
      session: sessionObjectId, // Match session as an ObjectId
    })
      .select("username email address phone _id") // Select the fields you want
      .exec();

    if (admins.length === 0) {
      return res
        .status(404)
        .json({ message: "No admins found for that session" });
    }

    return res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({ message: "Failed to get admins" });
  }
};

// export const updateAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedAdmin = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updatedAdmin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json(updatedAdmin);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// export const updateAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { sessionId, ...updateData } = req.body; // Extract sessionId

//     // If sessionId is provided, validate it
//     if (sessionId) {
//       const session = await Session.findById(sessionId);
//       if (!session) {
//         return res.status(400).json({ error: "Invalid session ID" });
//       }
//       updateData.session = sessionId; // Include sessionId in updateData
//     }

//     // Find and update the admin
//     const updatedAdmin = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedAdmin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json(updatedAdmin);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, password, ...updateData } = req.body; // Extract password

    // If sessionId is provided, validate it
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      updateData.session = sessionId; // Include sessionId in updateData
    }

    // Hash the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Find and update the admin
    const updatedAdmin = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedParent = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    res.status(200).json(updatedParent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const moveData = async (req, res) => {
  try {
    const { oldClassName, newClassName, sessionObjectId } = req.body; // Expecting oldClassName, newClassName, and sessionObjectId in the request body

    // Fetch all students in the old class
    const students = await User.find({
      role: "student",
      classname: oldClassName,
      session: sessionObjectId, // Ensure to filter by session as well
    })
      .select("AdmNo studentName address phone email parentsName classname _id")
      .exec();

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: `No students found in class ${oldClassName}` });
    }

    // Update each student's class to the new class
    const updatedStudents = await Promise.all(
      students.map(async (student) => {
        student.classname = newClassName; // Change the class to the new class
        return await student.save(); // Save the updated student
      })
    );

    res.json({
      message: `Successfully moved ${updatedStudents.length} students from ${oldClassName} to ${newClassName}`,
      updatedStudents,
    });
  } catch (error) {
    console.error("Error moving students to new class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const moveSubData = async (req, res) => {
  try {
    const { oldClassName, newClassName, sessionObjectId } = req.body; // Expecting oldClassName, newClassName, and sessionObjectId in the request body

    // Fetch all subjects in the old class for the specified session
    const subjects = await Subject.find({
      classname: oldClassName, // Assuming classname is a string or ObjectId
      session: sessionObjectId,
    }).exec();

    if (subjects.length === 0) {
      return res.status(404).json({
        message: `No subjects found in class ${oldClassName} for the given session`,
      });
    }

    // Update each subject's classname to the new class name
    const updatedSubjects = await Promise.all(
      subjects.map(async (subject) => {
        subject.classname = newClassName; // Change the class to the new class
        return await subject.save(); // Save the updated subject
      })
    );

    res.json({
      message: `Successfully changed ${updatedSubjects.length} subjects from ${oldClassName} to ${newClassName}`,
      updatedSubjects,
    });
  } catch (error) {
    console.error("Error changing class name:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findById(adminId); // Assuming you have an Admin model

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getParentById = async (req, res) => {
  try {
    const parentId = req.params.id;
    const parent = await User.findById(parentId); // Assuming you have an Admin model

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.json({ parent });
  } catch (error) {
    console.error("Error fetching parent by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: "No user found with that ID" });
    }

    // Perform additional checks if needed (e.g., user role, permissions)

    await user.remove(); // Remove the user from the database

    return res.status(200).json({ message: "User deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
// Delete user from a specific session
export const deleteUserFromSpecificSession = async (req, res) => {
  const { userId, sessionId } = req.params; // Get the userId and sessionId from the request params

  try {
    // Update the user document by pulling the specific sessionId from the session array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { session: sessionId } }, // Remove the sessionId from the session array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Session removed", user: updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error removing session", details: error.message });
  }
};

// export const createSetting = async (req, res) => {
//   try {
//     const { name, principalName, resumptionDate, examName, session } = req.body;

//     // Look for an existing setting with the specified session
//     let school = await Setting.findOne({ session, examName });

//     if (!school) {
//       // If no setting exists for the session, create a new one
//       school = new Setting();
//     }

//     // Update fields
//     school.name = name;
//     school.principalName = principalName;
//     school.resumptionDate = resumptionDate;
//     school.session = session; // Assign session ID
//     school.examName = examName; // Add exam name to the school profile

//     // Handle file upload if a signature file is provided
//     if (req.file) {
//       school.signature = req.file.location; // Use S3 location URL for signature
//       school.markModified("signature"); // Explicitly mark the signature as modified
//     }

//     // Log the full req.file object and S3 URL
//     console.log("File object:", req.file); // Displays the full req.file object
//     console.log(
//       "S3 File URL:",
//       req.file ? req.file.location : "No file uploaded"
//     );

//     // Save the document and log the result before and after saving
//     console.log("Before save:", school); // Log document before saving
//     await school.save();
//     console.log("After save:", school); // Log document after saving

//     res.status(200).json({
//       success: true,
//       message: school.isNew
//         ? "School profile created successfully"
//         : "School profile updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating school profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const createSetting = async (req, res) => {
//   try {
//     // Log incoming request body
//     console.log("Incoming request body:", req.body);

//     const { name, principalName, resumptionDate, examId, session } = req.body;

//     // Validate if the examId exists in the Exam collection
//     console.log("Checking if examId exists in Exam collection:", examId);
//     const exam = await Exam.findById(examId);

//     if (!exam) {
//       console.log("Exam not found:", examId);
//       return res
//         .status(400)
//         .json({ success: false, message: "Exam not found" });
//     }

//     // Look for an existing setting with the specified session and examId
//     console.log(
//       "Looking for existing setting for session:",
//       session,
//       "and examId:",
//       examId
//     );
//     let school = await Setting.findOne({ session, exam: examId });

//     if (!school) {
//       console.log("No existing setting found. Creating a new setting.");
//       // If no setting exists for the session and exam, create a new one
//       school = new Setting();
//     }

//     // Log the state of the school object before updating
//     console.log("Current school object:", school);

//     // Update fields
//     school.name = name;
//     school.principalName = principalName;
//     school.resumptionDate = resumptionDate;
//     school.session = session;
//     school.exam = examId; // Add examId as reference

//     // Handle file upload if a signature file is provided
//     if (req.file) {
//       console.log("File uploaded. Updating signature.");
//       school.signature = req.file.location; // Use S3 location URL for signature
//       school.markModified("signature"); // Explicitly mark the signature as modified
//     }

//     // Log the school object before saving
//     console.log("Before saving school object:", school);

//     // Save the document
//     await school.save();
//     console.log("After saving school object:", school);

//     // Send a response
//     res.status(200).json({
//       success: true,
//       message: school.isNew
//         ? "School profile created successfully"
//         : "School profile updated successfully",
//     });
//   } catch (error) {
//     // Log the error with detailed context
//     console.error("Error updating school profile:", error.message);
//     console.error("Stack trace:", error.stack);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

export const createSetting = async (req, res) => {
  try {
    // Log incoming request body
    console.log("Incoming request body:", req.body);

    const { name, principalName, resumptionDate, examName, session } = req.body;

    // Validate if the examName exists in the Exam collection
    console.log("Checking if examName exists in Exam collection:", examName);

    // Convert the examName (which is a string) to an ObjectId
    const examId = mongoose.Types.ObjectId(examName);

    // Find the exam by _id (which is the examName passed as a string)
    const exam = await Exam.findOne({ _id: examId });

    if (!exam) {
      console.log("Exam not found:", examName);
      return res
        .status(400)
        .json({ success: false, message: "Exam not found" });
    }

    // Look for an existing setting with the specified session and examId
    console.log(
      "Looking for existing setting for session:",
      session,
      "and examId:",
      exam._id
    );
    let school = await Setting.findOne({ session, exam: exam._id });

    if (!school) {
      console.log("No existing setting found. Creating a new setting.");
      // If no setting exists for the session and exam, create a new one
      school = new Setting();
    }

    // Log the state of the school object before updating
    console.log("Current school object:", school);

    // Update fields
    school.name = name;
    school.principalName = principalName;
    school.resumptionDate = resumptionDate;
    school.session = session;
    school.exam = exam._id; // Use the _id of the exam found

    // Handle file upload if a signature file is provided
    if (req.file) {
      console.log("File uploaded. Updating signature.");
      school.signature = req.file.location; // Use S3 location URL for signature
      school.markModified("signature"); // Explicitly mark the signature as modified
    }

    // Log the school object before saving
    console.log("Before saving school object:", school);

    // Save the document
    await school.save();
    console.log("After saving school object:", school);

    // Send a response
    res.status(200).json({
      success: true,
      message: school.isNew
        ? "School profile created successfully"
        : "School profile updated successfully",
    });
  } catch (error) {
    // Log the error with detailed context
    console.error("Error updating school profile:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const getSetting = async (req, res) => {
//   try {
//     const { sessionId, term } = req.query;

//     console.log("Query Parameters:", req.query); // Log the query parameters

//     // First, find the exam by its name (e.g., "FIRST TERM") to get the examId
//     const exam = await Exam.findOne({ name: term });
//     if (!exam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found for the specified term.",
//       });
//     }

//     console.log("Found exam:", exam); // Log the found exam details

//     // Now find the setting using the sessionId and the found examId
//     const setting = await Setting.findOne({
//       session: sessionId,
//       exam: exam._id, // Use the examId for the search
//     });

//     console.log("Setting found:", setting); // Log the result from the database

//     if (!setting) {
//       return res.status(404).json({
//         success: false,
//         message: "School setting not found for the specified session and term.",
//       });
//     }

//     return res.status(200).json({ success: true, data: setting });
//   } catch (error) {
//     console.error("Error fetching school setting:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// export const getSetting = async (req, res) => {
//   try {
//     const { sessionId, term } = req.query;

//     console.log("Received query parameters:", req.query); // Log query parameters

//     // Validate if the required parameters are passed
//     if (!sessionId || !term) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing sessionId or term." });
//     }

//     // Find the exam by term (exam name)
//     const exam = await Exam.findOne({ name: term });
//     if (!exam) {
//       console.log("Exam not found:", term);
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found for the specified term.",
//       });
//     }

//     console.log("Found exam:", exam); // Log exam details

//     // Now, find the setting using the sessionId and examId
//     const setting = await Setting.findOne({
//       session: sessionId,
//       exam: exam._id, // Use the _id of the found exam
//     });

//     if (!setting) {
//       console.log(
//         "Setting not found for session:",
//         sessionId,
//         "and exam:",
//         exam._id
//       );
//       return res.status(404).json({
//         success: false,
//         message: "School setting not found for the specified session and term.",
//       });
//     }

//     console.log("Setting found:", setting); // Log the found setting

//     return res.status(200).json({ success: true, data: setting });
//   } catch (error) {
//     console.error("Error fetching school setting:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
export const getSetting = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const term = decodeURIComponent(req.query.term);

    console.log("Received query parameters:", req.query); // Log query parameters
    console.log("Decoded term:", term); // Log the decoded term

    // Validate if the required parameters are passed
    if (!sessionId || !term) {
      return res
        .status(400)
        .json({ success: false, message: "Missing sessionId or term." });
    }

    // Find the exam by term (exam name)
    const exam = await Exam.findOne({ name: term, session: sessionId });

    if (!exam) {
      console.log("Exam not found:", term);
      return res.status(404).json({
        success: false,
        message: "Exam not found for the specified term.",
      });
    }

    console.log("Found exam:", exam); // Log exam details

    // Now, find the setting using the sessionId and examId
    const setting = await Setting.findOne({
      session: sessionId,
      exam: exam._id, // Use the _id of the found exam
    });

    if (!setting) {
      console.log(
        "Setting not found for session:",
        sessionId,
        "and exam:",
        exam._id
      );
      return res.status(404).json({
        success: false,
        message: "School setting not found for the specified session and term.",
      });
    }

    console.log("Setting found:", setting); // Log the found setting

    return res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error("Error fetching school setting:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAccountSetting = async (req, res) => {
  try {
    // Assuming you only have one school profile, you can fetch the first one
    const schoolSetting = await Account.findOne();

    if (!schoolSetting) {
      return res
        .status(404)
        .json({ success: false, message: "School setting not found" });
    }

    res.status(200).json({ success: true, data: schoolSetting });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const createAccount = async (req, res, s3) => {
//   console.log("Received S3 object:", s3);
//   try {
//     const {
//       name,
//       motto,
//       address,
//       phone,
//       phonetwo,
//       currency,
//       email,
//       sessionStart,
//       sessionEnd,
//     } = req.body;

//     // Check if school profile exists, create if not
//     let school = await Account.findOne();
//     if (!school) {
//       school = new Account();
//     }

//     school.name = name;
//     school.motto = motto;
//     school.address = address;
//     school.phone = phone;
//     school.phonetwo = phonetwo;
//     school.currency = currency;
//     school.email = email;
//     school.sessionStart = sessionStart;
//     school.sessionEnd = sessionEnd;

//     if (req.file) {
//       console.log("Uploading file to S3...");

//       // Add this function to handle the actual S3 upload
//       const uploadParams = {
//         Bucket: "edupros", // Replace with your bucket name
//         Key: `${Date.now()}-${req.file.originalname}`,
//         Body: req.file.buffer,
//         ACL: "public-read",
//         ContentType: req.file.mimetype,
//       };

//       // // Use the S3 uploadParams for the upload
//       // const result = await s3.putObject(uploadParams).promise();
//       // Use the putObject method
//       const result = await s3.putObject(uploadParams);

//       console.log("File uploaded successfully:", result.Location);
//       if (result && result.Location) {
//         school.schoolLogo = result.Key; // Use result.Key for the S3 key
//         console.log("File URL:", result.Location);
//       } else {
//         console.error("Error uploading file to S3:", result);
//       }

//       school.schoolLogo = result.Key; // Use result.Key for the S3 key
//     }

//     await school.save();
//     console.log("Updated School Profile:", school);

//     res
//       .status(200)
//       .json({ success: true, message: "School profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating school profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const createAccount = async (req, res, s3) => {
//   console.log("Received S3 object:", s3);
//   try {
//     const {
//       name,
//       motto,
//       address,
//       phone,
//       phonetwo,
//       currency,
//       email,
//       sessionStart,
//       sessionEnd,
//     } = req.body;

//     // Check if school profile exists, create if not
//     let school = await Account.findOne();
//     if (!school) {
//       school = new Account();
//     }

//     school.name = name;
//     school.motto = motto;
//     school.address = address;
//     school.phone = phone;
//     school.phonetwo = phonetwo;
//     school.currency = currency;
//     school.email = email;
//     school.sessionStart = sessionStart;
//     school.sessionEnd = sessionEnd;

//     if (req.file) {
//       console.log("Uploading file to S3...");

//       // Add this function to handle the actual S3 upload
//       const uploadParams = {
//         Bucket: "edupros", // Replace with your bucket name
//         Key: `${Date.now()}-${req.file.originalname}`,
//         Body: req.file.buffer,
//         ACL: "public-read",
//         ContentType: req.file.mimetype,
//       };

//       // Use the putObject method
//       const result = await s3.putObject(uploadParams);
//       console.log("S3 Upload Result:", result);
//       console.log("Upload Parameters:", uploadParams);

//       console.log("File uploaded successfully:", result.Location);
//       if (result && result.ETag) {
//         // Update the schoolLogo field with the file URL
//         // school.schoolLogo = `${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

//         school.schoolLogo = uploadParams.Key;

//         console.log("File URL:", school.schoolLogo);
//       } else {
//         console.error("Error uploading file to S3:", result);
//       }
//     }

//     await school.save();
//     console.log("Updated School Profile:", school);

//     // Add this console log to see the data in the database
//     const updatedSchool = await Account.findOne();
//     console.log("Data in the database:", updatedSchool);

//     res
//       .status(200)
//       .json({ success: true, message: "School profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating school profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

export const createAccount = async (req, res, s3) => {
  try {
    const {
      name,
      motto,
      address,
      phone,
      phonetwo,
      currency,
      email,
      sessionStart,
      sessionEnd,
    } = req.body;

    console.log("Received request body:", req.body);

    // Check if school profile exists, create if not
    let school = await Account.findOne();
    if (!school) {
      school = new Account();
    }

    school.name = name;
    school.motto = motto;
    school.address = address;
    school.phone = phone;
    school.phonetwo = phonetwo;
    school.currency = currency;
    school.email = email;
    school.sessionStart = sessionStart;
    school.sessionEnd = sessionEnd;

    if (req.file) {
      console.log("Received file:", req.file);

      // Add this function to handle the actual S3 upload
      const uploadParams = {
        Bucket: "edupros", // Replace with your bucket name
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };

      console.log("Upload Parameters:", uploadParams);

      // Use the putObject method
      const result = await s3.putObject(uploadParams);
      console.log("S3 Upload Result:", result);

      console.log("File uploaded successfully:", result.Location);
      if (result && result.ETag) {
        school.schoolLogo = uploadParams.Key;
        console.log("File URL:", school.schoolLogo);
      } else {
        console.error("Error uploading file to S3:", result);
      }
    }

    await school.save();
    console.log("Updated School Profile:", school);

    // Add this console log to see the data in the database
    const updatedSchool = await Account.findOne();
    console.log("Data in the database:", updatedSchool);

    res
      .status(200)
      .json({ success: true, message: "School profile updated successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const updateStudentById = async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const updatedData = req.body; // Assuming you send the updated data in the request body

//     // Validate and update the fields you want to allow modification for
//     const allowedUpdates = [
//       "studentName",
//       "AdmNo",
//       "classname",
//       "parentsName",
//       "gender",
//       "username",
//       "address",
//       "email",
//       "password",
//       "phone",
//     ];
//     const isValidUpdate = Object.keys(updatedData).every((update) =>
//       allowedUpdates.includes(update)
//     );

//     if (!isValidUpdate) {
//       return res.status(400).json({ error: "Invalid updates" });
//     }

//     const updatedStudent = await User.findByIdAndUpdate(
//       studentId,
//       updatedData,
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Run model validators on the update
//       }
//     );

//     if (!updatedStudent) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     res.status(200).json(updatedStudent);
//   } catch {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// export const updateStudentById = async (req, res) => {
//   try {
//     const studentId = req.params.id;
//     const { sessionId, ...updatedData } = req.body; // Extract sessionId and rest of the data

//     // Validate and update the fields you want to allow modification for
//     const allowedUpdates = [
//       "studentName",
//       "AdmNo",
//       "classname",
//       "parentsName",
//       "gender",
//       "username",
//       "address",
//       "email",
//       "password",
//       "phone",
//     ];
//     const isValidUpdate = Object.keys(updatedData).every((update) =>
//       allowedUpdates.includes(update)
//     );

//     if (!isValidUpdate) {
//       return res.status(400).json({ error: "Invalid updates" });
//     }

//     // If sessionId is provided, validate it
//     if (sessionId) {
//       const session = await Session.findById(sessionId);
//       if (!session) {
//         return res.status(400).json({ error: "Invalid session ID" });
//       }
//       updatedData.session = sessionId; // Include sessionId in updateData
//     }

//     const updatedStudent = await User.findByIdAndUpdate(
//       studentId,
//       updatedData,
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Run model validators on the update
//       }
//     );

//     if (!updatedStudent) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     res.status(200).json(updatedStudent);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const updateStudentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { sessionId, ...updateData } = req.body; // Extract sessionId

//     // If sessionId is provided, validate it
//     if (sessionId) {
//       const session = await Session.findById(sessionId);
//       if (!session) {
//         return res.status(400).json({ error: "Invalid session ID" });
//       }
//       updateData.session = sessionId; // Include sessionId in updateData
//     }

//     // Find and update the admin
//     const updatedStudent = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedStudent) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json(updatedStudent);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, password, ...updateData } = req.body; // Extract password

    // Log incoming data for verification
    console.log("Incoming data:", req.body);

    // If sessionId is provided, validate it
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      updateData.session = sessionId; // Include sessionId in updateData
    }

    // Hash the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
      console.log("New hashed password for student:", hashedPassword); // Log hashed password
    } else {
      console.log("No password provided for update.");
    }

    // Find and update the student
    const updatedStudent = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Updated student data:", updatedStudent); // Log updated student data
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTeacherById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTeacher = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // This option returns the modified document
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getTeacherById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const teacher = await User.findOne({ _id: id, role: "teacher" });

//     if (!teacher) {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     res.status(200).json({ teacher });
//   } catch {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await User.findById(teacherId); // Assuming you have an Admin model

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ teacher });
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getStudentsByClass = async (req, res) => {
//   const className = req.params.className;

//   try {
//     const students = await User.find({
//       role: "student",
//       classname: className,
//     })
//       .select("AdmNo studentName address phone email parentsName classname _id")
//       .exec();

//     console.log("Backend Response:", students); // Add this line

//     if (students.length === 0) {
//       return res.status(404).json({ error: "No students found in that class" });
//     }

//     return res.status(200).json(students);
//   } catch {
//     return res.status(500).json({ error: "Failed to get students" });
//   }
// };

export const getStudentsByClass = async (req, res) => {
  const { className, sessionId } = req.params;

  try {
    // Convert sessionId to ObjectId
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    const students = await User.find({
      role: "student",
      classname: className,
      session: sessionObjectId, // Add session filter here
    })
      .select("AdmNo studentName address phone email parentsName classname _id")
      .exec();

    console.log("Backend Response:", students); // Add this line

    if (students.length === 0) {
      return res
        .status(404)
        .json({ error: "No students found in that class and session" });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Failed to get students" });
  }
};
// export const getStudentById = async (req, res) => {
//   const studentId = req.params.id;
//   console.log("Requested studentId:", studentId);
//   if (!mongoose.Types.ObjectId.isValid(studentId)) {
//     return res.status(400).json({ error: "Invalid student ID" });
//   }
//   console.log("Requested studentId:", studentId);
//   try {
//     const student = await User.findById(studentId).exec();

//     if (!student) {
//       return res.status(404).json({ error: "No student found with that ID" });
//     }

//     // Check if the user's role is "student"
//     if (student.role !== "student") {
//       return res.status(403).json({ error: "Access denied. Not a student." });
//     }

//     return res.status(200).json(student);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to get student" });
//   }
// };

// export const getStudentById = async (req, res) => {
//   const studentId = req.params.id;
//   console.log("Requested studentId:", studentId);

//   if (!mongoose.Types.ObjectId.isValid(studentId)) {
//     const { id, sessionId } = req.params;
//     console.log("Requested id:", id);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       console.log("Invalid student ID");
//       return res.status(400).json({ error: "Invalid student ID" });
//     }

//     try {
//       const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//       const student = await User.find({
//         _id: id,
//         session: sessionObjectId,
//       }).exec();
//       console.log("Found student in database:", student);

//       if (!student) {
//         console.log("No student found with that ID");
//         return res.status(404).json({ error: "No student found with that ID" });
//       }

//       if (student.role !== "student") {
//         console.log("Access denied. Not a student.");
//         return res.status(403).json({ error: "Access denied. Not a student." });
//       }

//       // if (student.role !== "student") {
//       //   console.log("Access denied. Not a student.");
//       //   return res.status(403).json({ error: "Access denied. Not a student." });
//       // }

//       return res.status(200).json(student);
//     } catch {
//       return res.status(500).json({ error: "Failed to get student" });
//     }
//   }
// };

export const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId); // Assuming you have an Admin model

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentByIdBySession = async (req, res) => {
  const { id, sessionId } = req.params;
  console.log("Requested id:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid student ID");
    return res.status(400).json({ error: "Invalid student ID" });
  }

  try {
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    const student = await User.find({
      _id: id,
      session: sessionObjectId,
    }).exec();
    console.log("Found student in database:", student);

    if (!student) {
      console.log("No student found with that ID");
      return res.status(404).json({ error: "No student found with that ID" });
    }

    // if (student.role !== "student") {
    //   console.log("Access denied. Not a student.");
    //   return res.status(403).json({ error: "Access denied. Not a student." });
    // }

    return res.status(200).json(student);
  } catch {
    return res.status(500).json({ error: "Failed to get student" });
  }
};
// In your controller file
export const getStudentBySession = async (req, res) => {
  try {
    const studentId = req.params.id;
    const sessionId = req.params.sessionId;

    // Find the student by ID
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Assuming the student is associated with sessions, you can check or filter based on the sessionId.
    // This logic may depend on how sessions are related to students in your schema.
    const isSessionValid = student.sessions.includes(sessionId); // Example logic
    if (!isSessionValid) {
      return res
        .status(404)
        .json({ message: "Student not found in this session" });
    }

    // Return only the student information
    res.json({ student });
  } catch (error) {
    console.error("Error fetching student by session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentsBySession = async (req, res) => {
  const { sessionId } = req.params;
  console.log("Requested session ID:", sessionId);

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    console.log("Invalid session ID");
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    // Fetch all students with the matching session ID
    const students = await User.find({
      session: sessionObjectId,
      role: "student", // Assuming that you want only users with role "student"
    }).exec();

    console.log("Found students in database:", students);

    if (students.length === 0) {
      console.log("No students found for that session");
      return res
        .status(404)
        .json({ error: "No students found for that session" });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Failed to get students" });
  }
};

export const addSessionToUsersWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await User.updateMany(
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

export const addAnotherSessionToUserWithSession = async (req, res) => {
  try {
    const { sessionIds } = req.body; // Expect an array of session IDs

    // Validate that sessionIds is an array
    if (!Array.isArray(sessionIds)) {
      return res.status(400).json({ error: "sessionIds must be an array" });
    }

    // Migration: Convert session field to array if it's not already an array
    await User.updateMany(
      { session: { $exists: true, $not: { $type: "array" } } },
      { $set: { session: [] } }
    );

    // Ensure each session exists before adding
    const validSessions = await Session.find({ _id: { $in: sessionIds } });
    if (validSessions.length !== sessionIds.length) {
      return res
        .status(400)
        .json({ error: "One or more session IDs are invalid" });
    }

    // Add each sessionId to the session array of all users without duplicates
    const updateResult = await User.updateMany(
      {}, // No filter: This will apply to all users
      { $addToSet: { session: { $each: sessionIds } } } // Add each sessionId to the session array
    );

    res.status(200).json({
      message: "Sessions added successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Server Error" });
  }
};

export const moveClassesSessions = async (req, res) => {
  try {
    const { sessionIds } = req.body; // Expect an array of session IDs

    // Validate that sessionIds is an array
    if (!Array.isArray(sessionIds)) {
      return res.status(400).json({ error: "sessionIds must be an array" });
    }

    // Migration: Convert session field to array if it's not already an array
    await Class.updateMany(
      { session: { $exists: true, $not: { $type: "array" } } },
      { $set: { session: [] } }
    );

    // Ensure each session exists before adding
    const validSessions = await Session.find({ _id: { $in: sessionIds } });
    if (validSessions.length !== sessionIds.length) {
      return res
        .status(400)
        .json({ error: "One or more session IDs are invalid" });
    }

    // Add each sessionId to the session array of all users without duplicates
    const updateResult = await Class.updateMany(
      {}, // No filter: This will apply to all users
      { $addToSet: { session: { $each: sessionIds } } } // Add each sessionId to the session array
    );

    res.status(200).json({
      message: "Sessions for class added successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Server Error" });
  }
};

export const addSessionToDownloadWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Validate sessionId
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Bulk update users to include the sessionId if they don't already have one
    const updateResult = await Download.updateMany(
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
