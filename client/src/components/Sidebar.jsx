import { useState } from 'react';
import { LayoutDashboard, CheckSquare, Clock, User, LogOut, ListChecks, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: CheckSquare },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-top">
          {/* Brand/Logo */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <ListChecks size={24} />
            </div>
            <span className="sidebar-logo-text">Task<span>Flow</span></span>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                  id={`sidebar-tab-${item.id}`}
                  title={item.label}
                >
                  <span className="sidebar-nav-item-icon">
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {/* User Info Card — Click directly navigates to Profile */}
          <div
            className="sidebar-user"
            onClick={() => onTabChange('profile')}
            title="View your profile dashboard"
            id="sidebar-user-profile-trigger"
          >
            <div className="sidebar-avatar" id="sidebar-user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">{user?.name || 'User'}</span>
              <span className="sidebar-email">{user?.email || ''}</span>
            </div>
          </div>

          {/* Logout Trigger */}
          <button
            className="sidebar-logout"
            onClick={() => setShowLogoutConfirm(true)}
            id="sidebar-logout-trigger-btn"
            title="Logout of account"
          >
            <span className="sidebar-nav-item-icon">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal Dialog */}
      {showLogoutConfirm && (
        <div
          className="confirm-overlay"
          onClick={() => setShowLogoutConfirm(false)}
          id="logout-confirm-overlay"
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-icon">
              <AlertTriangle size={24} />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of TaskFlow? You will need to sign back in to access your workspace.</p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
                id="logout-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                id="logout-confirm-btn"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
