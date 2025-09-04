// ShortestPath.jsx
import React, { useState, useEffect } from "react";
import { getStations } from "./api";

export default function ShortestPath() {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("distance"); // 👈 new state
  const [pathResult, setPathResult] = useState(null);

  useEffect(() => {
    getStations().then(setStations);
  }, []);

  const findShortestPath = async () => {
    if (!from || !to) return alert("Select both stations");
    const res = await fetch(`/api/shortest-path?from=${from}&to=${to}&type=${type}`);
    const data = await res.json();
    setPathResult(data);
  };

  return (
    <div style={{ marginTop: 40, padding: 20, backgroundColor: "#F3E5F5", borderRadius: 12 }}>
      <h2 style={{ color: "#8E24AA" }}>📏 Shortest Path</h2>

      {/* From Station */}
      <div style={{ marginBottom: 10 }}>
        <label>From: </label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">-- Select --</option>
          {stations.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* To Station */}
      <div style={{ marginBottom: 10 }}>
        <label>To: </label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">-- Select --</option>
          {stations.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Path Type */}
      <div style={{ marginBottom: 10 }}>
        <label>Criteria: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="distance">Shortest by Distance</option>
          <option value="cost">Cheapest by Cost</option>
        </select>
      </div>

      {/* Button */}
      <button
        onClick={findShortestPath}
        style={{ padding: "10px 16px", backgroundColor: "#AB47BC", color: "#fff", border: "none", borderRadius: 6 }}
      >
        Find Path
      </button>

      {/* Results */}
      {pathResult && (
        <div style={{ marginTop: 20 }}>
          <h3>
            {type === "distance"
              ? `Total Distance: ${pathResult.total} km`
              : `Total Cost: ₹${pathResult.total}`}
          </h3>
          <p>
            Path:{" "}
            {pathResult.path.map((p, idx) => (
              <span key={p}>
                {stations.find((s) => s._id === p)?.name || p}
                {idx < pathResult.path.length - 1 ? " ➡️ " : ""}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
