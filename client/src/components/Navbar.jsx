import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-brand">
        <h2>Task<span>Flow</span></h2>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar" id="user-avatar">
            {getInitials(user?.name)}
          </div>
          <span className="navbar-greeting">
            Welcome, <strong>{user?.name?.split(' ')[0] || 'User'}</strong>
          </span>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
          id="logout-btn"
          aria-label="Logout"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
