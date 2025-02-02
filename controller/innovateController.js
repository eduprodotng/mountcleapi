import mongoose from "mongoose";
import Innovate from "../models/innovateModel.js";

export const createInnovate = async (req, res) => {
  try {
    const {
      fullname,
      email,
      instagram,
      phone,
      business,
      problem,
      hear,
      invite,
      plan,
    } = req.body;

    console.log("Request Body:", req.body);

    // Create a new application record
    const receipt = await Innovate.create({
      fullname,
      email,
      instagram,
      phone,
      business,
      problem,
      hear,
      invite,
      plan,
    });

    console.log("Receipt created:", receipt);

    // Respond with the created receipt
    return res.status(201).json({ receipt });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
