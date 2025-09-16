import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ShortestPath = () => {
  const [searchParams] = useSearchParams();
  //   const navigate = useNavigate();

  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [stations, setStations] = useState([]);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stationsLoading, setStationsLoading] = useState(true);

  // Get stations from URL params or initialize empty
  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from) setFromStation(from);
    if (to) setToStation(to);

    // If both stations are provided via URL, automatically find route
    if (from && to && from !== to) {
      findRoute(from, to);
    }
  }, [searchParams]);

  // Fetch all stations for dropdowns
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setStationsLoading(true);
        const response = await axios.get("http://localhost:5000/api/stations");
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setError("Failed to load stations");
      } finally {
        setStationsLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Find shortest route
  const findRoute = async (from = fromStation, to = toStation) => {
    if (!from || !to || from === to) {
      setError("Please select different stations");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setRoute(null);

      // Call your shortest path API
      const fromStationObj = stations.find((station) => station.name === from);
      const toStationObj = stations.find((station) => station.name === to);

      if (!fromStationObj || !toStationObj) {
        setError("Selected stations not found");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/shortest-path?from=${fromStationObj._id}&to=${toStationObj._id}&type=distance`
      );

      if (response.data) {
        // Convert station IDs back to names for display
        const pathNames = response.data.path.map((stationId) => {
          const station = stations.find(
            (s) => s._id.toString() === stationId.toString()
          );
          return station ? station.name : stationId;
        });

        setRoute({
          from: fromStation, // Use original station names
          to: toStation, // Use original station names
          path: pathNames, // Converted station names
          totalDistance: response.data.totalDistance,
          totalCost: response.data.totalCost,
          totalTime: response.data.totalTime,
          pathType: response.data.pathType
        });
      } else {
        setError("No route found between selected stations");
      }
    } catch (error) {
      console.error("Error finding route:", error);
      setError(
        error.response?.data?.message ||
          "Failed to find route. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setRoute(null);
    setError(null);
  };

  const handleFindRoute = () => {
    findRoute();
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const isFormValid = fromStation && toStation && fromStation !== toStation;

  if (stationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shortest-path-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Shortest Route
          </h1>
          <p className="text-gray-600">
            Get the fastest path between any two metro stations
          </p>
        </div>

        {/* Route Finder Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* From Station */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Station
              </label>
              <select
                value={fromStation}
                onChange={(e) => {
                  setFromStation(e.target.value);
                  setRoute(null);
                  setError(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                onChange={(e) => {
                  setToStation(e.target.value);
                  setRoute(null);
                  setError(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {/* Swap Button */}
            <button
              onClick={handleSwapStations}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Swap stations"
              disabled={!fromStation || !toStation}
            >
              <svg
                className="w-4 h-4 text-gray-600"
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

            {/* Find Route Button */}
            <button
              onClick={handleFindRoute}
              disabled={!isFormValid || loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isFormValid && !loading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finding Route...
                </div>
              ) : (
                "🚀 Find Shortest Route"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Same Station Warning */}
          {fromStation === toStation && fromStation && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
              Please select different stations for source and destination
            </div>
          )}
        </div>

        {/* Route Results */}
        {route && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎯 Route Found!
            </h2>

            {/* Route Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {route.totalDistance} km
                </div>
                <div className="text-sm text-gray-600">Total Distance</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹ {route.totalCost}
                </div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </div>
              {/* change */}
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(route.totalTime)}
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {route.path?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Stations</div>
              </div>
            </div>

            {/* Route Path */}
            {route.path && route.path.length > 0 && (
              <div className="route-path">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Route Path:
                </h3>
                <div className="relative">
                  {route.path.map((station, index) => (
                    <div
                      key={index}
                      className="relative flex items-center mb-4 last:mb-0"
                    >
                      {/* Connection Line */}
                      {index < route.path.length - 1 && (
                        <div className="absolute left-2 top-6 w-0.5 h-8 bg-gray-300 z-0"></div>
                      )}

                      {/* Station Container */}
                      <div className="flex items-center relative z-10 bg-white">
                        {/* Station Dot */}
                        <div
                          className={`w-4 h-4 rounded-full mr-4 shadow-md ${
                            index === 0
                              ? "bg-green-500"
                              : index === route.path.length - 1
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        ></div>

                        {/* Station Info */}
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {station}
                          </span>
                          {index === 0 && (
                            <span className="text-green-600 text-sm ml-2 font-medium">
                              (Start)
                            </span>
                          )}
                          {index === route.path.length - 1 && (
                            <span className="text-red-600 text-sm ml-2 font-medium">
                              (End)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortestPath;
