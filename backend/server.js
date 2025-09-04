// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

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

//import auth routes
import authRoutes from './routes/auth.js'
import { authMiddleware, adminOnly } from './middlewares/auth.middleware.js';

app.use("/api/auth", authRoutes);


// Import routes (stations)
import stationRoutes from './routes/stationRoutes.js';
import shortestPathRoutes from './routes/shortestPath.js';

app.use("/api/stations", authMiddleware, adminOnly, stationRoutes);
app.use('/api/shortest-path', shortestPathRoutes);


// Add other routes similarly, e.g., paths, users, etc.
// import pathRoutes from './routes/pathRoutes.js';
// app.use('/api/paths', pathRoutes);


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
