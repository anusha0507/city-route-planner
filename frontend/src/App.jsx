// App.jsx
import React, { useContext, useState } from "react";
import AdminDashboard from "./components/AdminDashboard.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Login from "./components/Login";
import Register from "./components/Register.jsx";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <div>
        {showRegister ? (
          <Register onRegistered={() => setShowRegister(false)} />
        ) : (
          <Login />
        )}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? "Have an account? Login" : "No account? Register"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      {user.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
