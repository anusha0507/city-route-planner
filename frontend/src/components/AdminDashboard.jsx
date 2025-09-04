// components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { getStations, createStation, connectStations } from "../api";

export default function AdminDashboard() {
  const [stations, setStations] = useState([]);
  const [newStationName, setNewStationName] = useState("");
  const [firstStation, setFirstStation] = useState("");
  const [secondStation, setSecondStation] = useState("");
  const [distance, setDistance] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    const data = await getStations();
    setStations(data);
  }

  async function handleCreateStation(e) {
    e.preventDefault();
    if (!newStationName) return alert("Enter station name");
    setLoading(true);
    await createStation(newStationName);
    setNewStationName("");
    await fetchStations();
    setLoading(false);
  }

  async function handleConnectStations(e) {
    e.preventDefault();
    if (!firstStation || !secondStation || !distance || !cost)
      return alert("Fill all fields");
    setLoading(true);
    await connectStations({
      firstStation,
      secondStation,
      distance: Number(distance),
      cost: Number(cost),
    });
    setFirstStation("");
    setSecondStation("");
    setDistance("");
    setCost("");
    await fetchStations();
    setLoading(false);
  }

  return (
    <div>
      <h2>🛠 Admin Dashboard</h2>

      {/* Create Station */}
      <form onSubmit={handleCreateStation}>
        <input
          type="text"
          value={newStationName}
          onChange={(e) => setNewStationName(e.target.value)}
          placeholder="Station name"
        />
        <button type="submit">Add</button>
      </form>

      {/* Connect Stations */}
      <form onSubmit={handleConnectStations}>
        <select value={firstStation} onChange={(e) => setFirstStation(e.target.value)}>
          <option value="">From Station</option>
          {stations.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select value={secondStation} onChange={(e) => setSecondStation(e.target.value)}>
          <option value="">To Station</option>
          {stations.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance (km)"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost (₹)"
        />
        <button type="submit">Connect</button>
      </form>

      {/* Station List */}
      <h3>📋 Stations</h3>
      <ul>
        {stations.map((station) => (
          <li key={station._id}>
            <strong>{station.name}</strong>
            <ul>
              {station.connections.map((c, i) => (
                <li key={i}>
                  ➝ {c.station?.name || c.station} | {c.distance} km | ₹{c.cost}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
