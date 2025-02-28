import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }
    const user = await User.create({ name, email: normalizedEmail, password, role });
    res.status(201).json({
      message: "User Registered Successfully!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "User not found. Please register first." });
    console.log("🔹 Entered Password:", password);
    console.log("🔹 Stored Hashed Password in DB:", user.password);
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("⚠ Password does not match!");
      return res.status(400).json({ message: "Invalid email or password." });
    }
    res.json({
      message: "Login Successful!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
};


