import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "Account created successfully.", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in prod
        sameSite: "Lax",
        maxAge: 3600000, // 1 hour
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullName}`,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({ success: true, message: "Logged out successfully." });
};