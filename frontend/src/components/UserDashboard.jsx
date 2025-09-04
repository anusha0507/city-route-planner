// components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getStations } from "../api";

export default function UserDashboard() {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("distance");
  const [pathResult, setPathResult] = useState(null);

  useEffect(() => {
    getStations().then(setStations);
  }, []);

  async function handleFindPath(e) {
    e.preventDefault();
    if (!from || !to) return alert("Select both stations");
    try {
      const res = await axios.get("http://localhost:5000/api/shortest-path", {
        params: { from, to, type },
      });
      const stationMap = {};
      stations.forEach((s) => (stationMap[s._id] = s.name));
      const readablePath = res.data.path.map((id) => stationMap[id] || id);
      setPathResult({ ...res.data, readablePath });
    } catch {
      alert("No path found");
    }
  }

  return (
    <div>
      <h2>🧭 User Dashboard</h2>
      <form onSubmit={handleFindPath}>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">From</option>
          {stations.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">To</option>
          {stations.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="distance">Shortest by Distance</option>
          <option value="cost">Cheapest by Cost</option>
        </select>

        <button type="submit">Find Path</button>
      </form>

      {pathResult && (
        <div>
          <p><strong>Stations:</strong> {pathResult.readablePath.join(" → ")}</p>
          {pathResult.totalDistance !== undefined ? (
            <p><strong>Total Distance:</strong> {pathResult.totalDistance} km</p>
          ) : (
            <p><strong>Total Cost:</strong> ₹{pathResult.totalCost}</p>
          )}
        </div>
      )}
    </div>
  );
}
