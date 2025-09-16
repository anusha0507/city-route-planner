import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { authMiddleware, superAdminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(400).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only superadmin can create new admins
router.post("/create-admin", authMiddleware, superAdminOnly, async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
