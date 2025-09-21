const API_BASE_URL = "https://city-route-planner.onrender.com"

//get auth headers
const getAuthHeaders = ()=>{
    const token = localStorage.getItem("token");
    return{
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
};
};

//handle api responses
const handleResponse = async(response) =>{
    if(!response.ok){
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
    }
    return response.json();
}


//auth api endpoints

export const authAPI = {


  // Login admin
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

//create admins(only superadmin can create admins)
createAdmin: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/create-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  }

};


//station endpoints
export const stationAPI = {

    //get all stations
    getStations: async () => {
    const response = await fetch(`${API_BASE_URL}/api/stations`);
    return handleResponse(response);
  },


  //create stations(admins only)
  createStation: async (name) => {
    const response = await fetch(`${API_BASE_URL}/api/stations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name })
    });
    return handleResponse(response);
  },

  //connect two stations(admin only)
  connectStations: async (firstStation, secondStation, distance, cost, travelTime) => {
    const response = await fetch(`${API_BASE_URL}/api/stations/connect`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        firstStation, 
        secondStation, 
        distance, 
        cost, 
        travelTime 
      })
    });
    return handleResponse(response);
  },

  //update station(admin only)
  updateStation: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/api/stations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  //delete station(admin only)
  deleteStation: async (id) =>{
    const response = await fetch(`${API_BASE_URL}/api/station/${id}` ,{
        method: "DELETE",
        headers: getAuthHeaders,
    })
    return handleResponse(response);
  }

};


//shortest path endpoint
export const pathAPI = {

  // shortest path between stations
  findShortestPath: async (from, to, type = 'distance') => {
    const response = await fetch(
      `${API_BASE_URL}/api/shortest-path?from=${from}&to=${to}&type=${type}`
    );
    return handleResponse(response);
  }
};

