import express from "express";
import Station from "../models/Station.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --------------------
// PUBLIC ROUTES
// --------------------

// GET /api/stations - fetch all stations with connected station names
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find().populate("connections.station", "name");
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// ADMIN ROUTES (Protected)
// --------------------

// POST /api/stations - create a new station
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Station name is required" });
  }

  try {
    const existingStation = await Station.findOne({ name });
    if (existingStation) {
      return res.status(400).json({ error: "Station already exists" });
    }

    const station = new Station({ name, connections: [] });
    await station.save();

    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stations/connect - connect two stations
router.post("/connect", authMiddleware, adminOnly, async (req, res) => {
  const { firstStation, secondStation, distance, cost, travelTime } = req.body;

if (!firstStation || !secondStation || !distance || !cost) {
  return res.status(400).json({ error: "All fields are required" });
}

  try {
    const station1 = await Station.findById(firstStation);
    const station2 = await Station.findById(secondStation);

    if (!station1 || !station2) {
      return res.status(404).json({ error: "One or both stations not found" });
    }

    // Avoid duplicate connections
    const alreadyConnected1 = station1.connections.some(
      (conn) => conn.station.toString() === secondStation
    );
    const alreadyConnected2 = station2.connections.some(
      (conn) => conn.station.toString() === firstStation
    );

    if (!alreadyConnected1) {
      station1.connections.push({ station: secondStation, distance, cost, travelTime });
    }

    if (!alreadyConnected2) {
      station2.connections.push({ station: firstStation, distance, cost, travelTime });
    }

    await station1.save();
    await station2.save();

    res.json({ message: "Stations connected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stations/:id - update station details
router.put("/api/stations/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!station) return res.status(404).json({ error: "Station not found" });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/stations/:id - delete a station
router.delete("/api/stations/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ error: "Station not found" });
    res.json({ message: "Station deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
