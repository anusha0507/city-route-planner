import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [stations, setStations] = useState([]);
  const [location, setLocation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stations")
      .then((res) => setStations(res.data))
      .catch((err) => console.error("Error fetching stations:", err));
  }, []);

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  useEffect(() => {
    fetchLocations();
  }, []);
  // fetchLocations
  async function fetchLocations() {
    try {
      const res = await axios.get("http://localhost:5000/api/stations");
      setLocation(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  }

  const handleFindRoute = () => {
    if (fromStation && toStation && fromStation !== toStation) {
      // Navigate to shortest-path page with selected stations
      navigate(
        `/shortest-path?from=${encodeURIComponent(
          fromStation
        )}&to=${encodeURIComponent(toStation)}`
      );
    }
  };

  const isFormValid = fromStation && toStation && fromStation !== toStation;

  const cardStyle = {
    background: "#ffffffdd",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
  };

  return (
    <div className="homepage min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-18">
      {/* Hero Section */}
      <div className="hero-section pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Find Your <span className="text-blue-600">Fastest Route</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Get the shortest path between any two stations on Indore Metro
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                🚇 <span className="ml-1">{stations.length} Stations</span>
              </span>
              <span>•</span>
              <span className="flex items-center">
                🚀 <span className="ml-1">Instant Results</span>
              </span>
              <span>•</span>
              <span className="flex items-center">
                ⚡ <span className="ml-1">Always Updated</span>
              </span>
            </div>
          </div>

          {/* Route Finder Form */}
          <div className="route-finder bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* From Station */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Station
                </label>
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select starting station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station.name}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Station */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Station
                </label>
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select destination station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station.name}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleSwapStations}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                title="Swap stations"
                disabled={!fromStation || !toStation}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* Find Route Button */}
            <button
              onClick={handleFindRoute}
              disabled={!isFormValid}
              className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              🚀 Find Shortest Route
            </button>

            {fromStation === toStation && fromStation && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Please select different stations for source and destination
              </p>
            )}
          </div>

          {/* Location display */}
          <section style={cardStyle} className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="locationUI text-blue-800 font-bold text-xl mb-5">Locations:</h2>
            <div className="text-left">
            {location.length === 0 ? (
              <h3>No locations added.</h3>
            ) : (
              <ul className="stationName list-disc">
                {location.map((loc) => (
                  <li key={loc._id} style={{ marginBottom: 20 }}>
                    <strong className="text-cyan-900 py-4">{loc.name}</strong>
                    {loc.connections && loc.connections.length > 0 ? (
                      <ul>
                        {loc.connections.map((conn, idx) => (
                          <li key={idx}>
                            ➝ <strong>{conn.station?.name || "Unknown"}</strong>{" "}
                            | {conn.distance} km | ₹{conn.cost} | {conn.travelTime} min
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ marginLeft: 20, color: "#777" }}>
                        No connections
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            </div>
          </section>

          {/* How It Works */}
          <div className="how-it-works">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="step text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Select Stations
                </h3>
                <p className="text-gray-600 text-sm">
                  Choose your starting point and destination from available
                  metro stations
                </p>
              </div>

              <div className="step text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Find Route</h3>
                <p className="text-gray-600 text-sm">
                  Our algorithm calculates the shortest and fastest path for
                  your journey
                </p>
              </div>

              <div className="step text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Travel Smart
                </h3>
                <p className="text-gray-600 text-sm">
                  Follow the route with step-by-step directions and estimated
                  time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="stat">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stations.length}
              </div>
              <div className="text-gray-600">Metro Stations</div>
            </div>
            <div className="stat">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600">Metro Lines</div>
            </div>
            <div className="stat">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Route Planning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
