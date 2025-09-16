import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import './Layout.css';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for existing token on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Header Navigation */}
      <header className="header">
        <nav className="navbar fixed top-0 w-full bg-white shadow-md z-50 px-6 py-4">
          <div className="flex justify-between items-center w-full">
            {/* Left: Brand/Logo */}
            <div className="nav-brand">
              <Link to="/" className="flex items-center text-xl font-bold text-blue-600 hover:text-blue-700">
                🚇 <span className="ml-2">Indore Route Pathfinder</span>
              </Link>
            </div>

            {/* Center: Main Navigation Links */}
            <div className="nav-center flex space-x-8">
              <Link 
                to="/" 
                className={`nav-link px-4 py-2 rounded-md transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              
              <Link 
                to="/shortest-path" 
                className={`nav-link px-4 py-2 rounded-md transition-colors ${
                  isActive('/shortest-path') 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                Find Route
              </Link>
            </div>

            {/* Right: Auth Section */}
            <div className="nav-right">
              {user ? (
                <div className="admin-section flex items-center space-x-4">
                  <Link 
                    to="/admin" 
                    className={`nav-link px-4 py-2 rounded-md transition-colors ${
                      isActive('/admin') 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Admin Panel
                  </Link>
                  <div className="user-info flex items-center space-x-2">
                    <span className="user-role text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {user.role}
                    </span>
                    <button 
                      onClick={logout} 
                      className="logout-btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
  to="/login" 
  className={`login-btn px-6 py-2 rounded-md transition-colors ${
    isActive('/login') 
      ? 'bg-blue-600 !text-white' 
      : 'bg-blue-500 !text-white hover:bg-blue-600'
  }`}
>
  Admin Login
</Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
  <div className="container sticky bottom-0 text-center w-full bg-white z-50 px-6 py-4 shadow-[0_-2px_5px_rgba(0,0,0,0.1)]">
    <p>&copy; 2025 Indore Route System</p>
  </div>
</footer>

    </div>
  );
};

export default Layout;