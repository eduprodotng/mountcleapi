import express from "express";
import {
  getallUsers,
  getUsers,
  loginUser,
  register,
} from "../controller/adminController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/getusers/:id", authenticateUser, getUsers);
router.get("/getallusers", authenticateUser, getallUsers);

export default router;
