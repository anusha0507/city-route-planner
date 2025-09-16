import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import { authMiddleware, adminOnly, superAdminOnly } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Root route to test server
app.get('/', (req, res) => {
  res.send('Indore Metro Backend is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// superadmin seeding
async function seedSuperAdmin() {
  const super_password = process.env.SUPER_ADMIN_PASSWORD || "nimdarepus0011";
  const exists = await Admin.findOne({ role: "superadmin" });
  if (!exists) {
    const hashedPassword = await bcrypt.hash(super_password, 10);
    await Admin.create({
      username: "superadmin",
      password: hashedPassword,
      role: "superadmin"
    });
    console.log(`✅ Superadmin created: username=superadmin, password=${super_password}`);
  }
}

mongoose.connection.once("open", () => {
  seedSuperAdmin();
});

// import auth routes
import authRoutes from './routes/auth.js';
app.use("/api/auth", authRoutes);

// Import routes
import stationRoutes from './routes/stationRoutes.js';
import shortestPathRoutes from './routes/shortestPath.js';

// Protect station management with admin auth
app.use("/api/stations", stationRoutes);
app.use('/api/shortest-path', shortestPathRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
