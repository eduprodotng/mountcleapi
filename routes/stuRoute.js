// import express from "express";
// import {
//   allClass,
//   deleteStudent,
//   getallUsers,
//   getuserClass,
//   getuserClass2,
//   getuserClass3,
//   getuserClass4,
//   getuserClass5,
//   getuserClass6,
//   getUsers,
//   loginUser,
//   register,
//   Search,
// } from "../controller/stuController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", loginUser);
// router.get("/getallusers", getallUsers);
// router.get("/clo", getuserClass);
// router.get("/clo2", getuserClass2);
// router.get("/clo3", getuserClass3);
// router.get("/clo4", getuserClass4);
// router.get("/clo5", getuserClass5);
// router.get("/clo6", getuserClass6);

// router.get("/class/:id", allClass);
// router.delete("/delete/:id", deleteStudent);
// router.get("/search/:name/:class/:roll_no", Search);
// router.get("/getusers/:id", getUsers);

// export default router;

// authRoutes.js
import express from "express";
import {
  getStudentsByClass,
  getStudentById,
  getStudentsByClassAndSession,
} from "../controller/stuController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// New route to get students by class
router.get("/students/:classname", getStudentsByClass);
router.get("/students/:sessionId/:classname", getStudentsByClassAndSession);

// Change the route pattern for getStudentById
router.get("/student/:id", authenticateUser, getStudentById);

export default router;
