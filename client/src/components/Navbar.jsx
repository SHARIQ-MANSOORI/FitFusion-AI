import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">FitFusion AI</span>
      {user ? (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/workout">Workout</Link>
          <Link to="/diet">Diet</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/progress">Progress</Link>
          <span className="navbar-user">{user.name}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
