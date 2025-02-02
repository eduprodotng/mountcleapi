/* global process */

import Ad from "../models/adModel.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const { username, email, address, phone, isAdmin } = req.body;
  const user = await Ad.create({
    email,
    phone,
    password: hash,
    address,
    username,
    isAdmin,
  });
  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });
  if (user) {
    const { _id, username, email, phone, address, password, isAdmin } = user;
    res.status(201).json({
      _id,
      username,
      email,
      phone,
      address,
      isAdmin,
      password,
      token,
    });
  } else {
    res.status(400);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Ad.findOne({ email, password });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

/*export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, email } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ password, email });
  } catch (err) {
    next(err);
  }
};*/

/*export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, username, email, password } = user;
    res.status(200).json({
      _id,
      username,
      email,
      password,
    });
  } else {
    res.status(400);
  }
};*/
export const getallUsers = async (res, next) => {
  try {
    const users = await Ad.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await Ad.findById(req.users.id);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
