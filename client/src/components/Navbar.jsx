import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">⚡</span>
        <span>FitFusion <span className="navbar-brand-badge">AI</span></span>
      </Link>
      {user ? (
        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/workout" className={isActive('/workout')}>Workout</Link>
          <Link to="/diet" className={isActive('/diet')}>Diet</Link>
          <Link to="/chat" className={isActive('/chat')}>Chat</Link>
          <Link to="/progress" className={isActive('/progress')}>Progress</Link>
          <div className="navbar-user-badge">
            <span className="navbar-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            <span className="navbar-user">{user.name}</span>
          </div>
          <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className={isActive('/login')}>Login</Link>
          <Link to="/register" className={isActive('/register')}>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
