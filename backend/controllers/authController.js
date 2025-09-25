import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Allow @sot.pdpu.ac.in (and easy toggle for @pdpu.ac.in if needed)
const validateStudentEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@sot\.pdpu\.ac\.in$/.test(email);
  // For both: return /^[a-zA-Z0-9._%+-]+@(sot\.)?pdpu\.ac\.in$/.test(email);
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Name, email, and password are required" });

    if (!validateStudentEmail(email))
      return res.status(400).json({ msg: "Only @sot.pdpu.ac.in emails allowed" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, credibility: user.credibility },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    if (!validateStudentEmail(email))
      return res.status(400).json({ msg: "Only @sot.pdpu.ac.in emails allowed" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, credibility: user.credibility },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
