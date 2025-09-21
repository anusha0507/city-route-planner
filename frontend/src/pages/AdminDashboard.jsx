import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateAdminForm from "../components/CreateAdminForm";


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStations: 0,
    totalConnections: 0,
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Station Form
  const [newStation, setNewStation] = useState({
    name: "",
  });
  const [addingStation, setAddingStation] = useState(false);
  const [stationSuccess, setStationSuccess] = useState("");
  const [stationError, setStationError] = useState("");

  // New Connection Form
  const [newConnection, setNewConnection] = useState({
    fromStation: "",
    toStation: "",
    distance: "",
    cost: "",
    travelTime:"",
  });
  const [addingConnection, setAddingConnection] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState("");
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://city-route-planner.onrender.com/api/stations");
      const stationsData = response.data;

      setStations(stationsData);

      // Calculate statistics
      let totalConnections = 0;
      stationsData.forEach((station) => {
        totalConnections += station.connections.length;
      });

      setStats({
        totalStations: stationsData.length,
        totalConnections: totalConnections,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
      if (error) {
        console.log(error);
      }
    }
  };

  // exp 
  const userRole = localStorage.getItem("role");
  //exp end

  const handleAddStation = async (e) => {
    e.preventDefault();
    if (!newStation.name.trim()) {
      setStationError("Station name is required");
      return;
    }

    try {
      setAddingStation(true);
      setStationError("");
      setStationSuccess("");

      const token = localStorage.getItem("token");

      await axios.post(
        "https://city-route-planner.onrender.com/api/stations",
        {
          name: newStation.name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStationSuccess("Station added successfully!");
      setTimeout(() => {
      setStationSuccess("");
      }, 3000);
      setNewStation({ name: "" });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error adding station:", error);
      setStationError(error.response?.data?.message || "Failed to add station");
    } finally {
      setAddingStation(false);
    }
  };

  const handleAddConnection = async (e) => {
  e.preventDefault();

  if (
    !newConnection.fromStation ||
    !newConnection.toStation ||
    !newConnection.distance ||
    !newConnection.cost ||
    !newConnection.travelTime
  ) {
    setConnectionError("All fields are required");
    return;
  }

  if (newConnection.fromStation === newConnection.toStation) {
    setConnectionError("From and To stations must be different");
    return;
  }

  try {
    setAddingConnection(true);
    setConnectionError("");
    setConnectionSuccess("");

    const token = localStorage.getItem('token');

    const response = await axios.post('https://city-route-planner.onrender.com/api/stations/connect', {
      firstStation: newConnection.fromStation,    // Match backend field name
      secondStation: newConnection.toStation,     // Match backend field name
      distance: parseFloat(newConnection.distance),
      cost: parseFloat(newConnection.cost),
      travelTime: parseFloat(newConnection.travelTime)
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    setConnectionSuccess("Connection added successfully!");
    setTimeout(() => {
        setConnectionSuccess("");
      }, 3000);
    setNewConnection({
      fromStation: "",
      toStation: "",
      distance: "",
      cost: "",
      travelTime: "",
    });
    fetchData(); // Refresh data
  } catch (error) {
    console.error("Error adding connection:", error);
    
    // Better error handling
    if (error.response) {
      // Server responded with error status
      console.error('Error response:', error.response.data);
      setConnectionError(error.response.data.error || error.response.data.message || "Failed to add connection");
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      setConnectionError("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.error('Error message:', error.message);
      setConnectionError(error.message || "Failed to add connection");
    }
  } finally {
    setAddingConnection(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gray-50 py-8 mt-18">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage Indore Metro System</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Stations
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalStations}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Connections
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalConnections}
            </p>
          </div>
        </div>

        {/* exp for superadmin to add new admin */}
        {userRole === 'superadmin' && (
         <CreateAdminForm />
       )}
        {/* exp end */}

        <div className="grid grid-cols-1 gap-8">
          {/* Add New Station Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Add New Station
            </h2>

            <form onSubmit={handleAddStation}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Station Name *
                </label>
                <input
                  type="text"
                  value={newStation.name}
                  onChange={(e) =>
                    setNewStation({ ...newStation, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter station name"
                  required
                />
              </div>

              {stationError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {stationError}
                </div>
              )}

              {stationSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {stationSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={addingStation}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  addingStation
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {addingStation ? "Adding Station..." : "Add Station"}
              </button>
            </form>
          </div>

          {/* Add New Connection Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Connect Two Stations
            </h2>

            <form onSubmit={handleAddConnection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Station *
                </label>
                <select
                  value={newConnection.fromStation}
                  onChange={(e) =>
                    setNewConnection({
                      ...newConnection,
                      fromStation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select from station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Station *
                </label>
                <select
                  value={newConnection.toStation}
                  onChange={(e) =>
                    setNewConnection({
                      ...newConnection,
                      toStation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select to station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newConnection.distance}
                    onChange={(e) =>
                      setNewConnection({
                        ...newConnection,
                        distance: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newConnection.cost}
                    onChange={(e) =>
                      setNewConnection({
                        ...newConnection,
                        cost: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time (min) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newConnection.travelTime}
                    onChange={(e) =>
                      setNewConnection({
                        ...newConnection,
                        travelTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="15"
                    required
                  />
                </div>
              </div>

              {connectionError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {connectionError}
                </div>
              )}

              {connectionSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {connectionSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={addingConnection}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  addingConnection
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {addingConnection ? "Adding Connection..." : "Add Connection"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
