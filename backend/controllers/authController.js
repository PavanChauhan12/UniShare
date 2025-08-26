import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateEmail = (email) => {
  const studentRegex = /^[a-zA-Z0-9._%+-]+@sot\.pdpu\.ac\.in$/i;
  const facultyRegex = /^[a-zA-Z0-9._%+-]+@pdpu\.ac\.in$/i;

  if (studentRegex.test(email)) return "student";
  if (facultyRegex.test(email)) return "faculty";
  return null;
};


// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const designation = validateEmail(email);
    if (!designation) {
      return res.status(400).json({ msg: "Only emails associated with PDPU domain allowed" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, designation });
    await user.save();

    const token = jwt.sign({ id: user._id, designation: user.designation }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, designation: user.designation } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const designation = validateEmail(email);
    if (!designation) {
      return res.status(400).json({ msg: "Only emails associated with PDPU domain allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, designation: user.designation }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, designation: user.designation } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
