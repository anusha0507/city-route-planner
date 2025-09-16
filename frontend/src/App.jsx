import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/HomePage";
import ShortestPath from "./pages/ShortestPath";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute, { SuperAdminRoute, AdminRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/shortest-path" element={<ShortestPath />} />
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected routes */}
           <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard/>
              </AdminRoute>
            }
          />
          {/*
          <Route
            path="/super-admin-panel"
            element={
              <SuperAdminRoute>
                <div>Super Admin Panel Page</div>
              </SuperAdminRoute>
            }
          /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
