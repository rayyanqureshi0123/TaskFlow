import { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, Search, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { tasksAPI, authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, today: 0 });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ email: '', currentPassword: '', newPassword: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // Trigger once
            }
          });
        },
        {
          threshold: 0.02,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => observer.observe(el));

      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [tasks, loading, activeTab]);

  const getTimeGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8, // Fit nicely in 2-column grid
        status: statusFilter !== 'all' && statusFilter !== 'today' ? statusFilter : undefined,
        search: search.trim() || undefined
      };

      if (statusFilter === 'today') {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        params.dueDate = `${year}-${month}-${day}`;
        params.status = 'pending';
      }

      const { data } = await tasksAPI.getAll(params);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load tasks.');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  const fetchStats = useCallback(async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const [allRes, pendingRes, completedRes, todayRes] = await Promise.all([
        tasksAPI.getAll({ limit: 1 }),
        tasksAPI.getAll({ limit: 1, status: 'pending' }),
        tasksAPI.getAll({ limit: 1, status: 'completed' }),
        tasksAPI.getAll({ limit: 1, status: 'pending', dueDate: todayStr })
      ]);
      setStats({
        total: allRes.data.pagination.total,
        pending: pendingRes.data.pagination.total,
        completed: completedRes.data.pagination.total,
        today: todayRes.data.pagination.total
      });
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      setActiveTab('dashboard');
      setStatusFilter('all');
    } else if (tabId === 'today') {
      setActiveTab('dashboard');
      setStatusFilter('today');
    } else if (tabId === 'completed') {
      setActiveTab('dashboard');
      setStatusFilter('completed');
    } else if (tabId === 'pending') {
      setActiveTab('dashboard');
      setStatusFilter('pending');
    } else if (tabId === 'profile') {
      setActiveTab('profile');
    }
  };

  const handleStartEditProfile = () => {
    setProfileForm({
      email: user?.email || '',
      currentPassword: '',
      newPassword: ''
    });
    setProfileErrors({});
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const errs = {};
    if (!profileForm.email.trim()) {
      errs.email = 'Email is required.';
    }
    if (!profileForm.currentPassword) {
      errs.currentPassword = 'Current password is required.';
    }
    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters.';
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    setUpdatingProfile(true);
    try {
      const payload = {
        email: profileForm.email.trim(),
        currentPassword: profileForm.currentPassword,
        newPassword: profileForm.newPassword || undefined
      };

      const { data } = await authAPI.updateProfile(payload);
      toast.success(data.message || 'Profile updated successfully!');

      if (updateUser) {
        updateUser(data.user);
      }
      setIsEditingProfile(false);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      if (error.response?.data?.errors) {
        const validationErrs = {};
        error.response.data.errors.forEach(err => {
          validationErrs[err.param || err.path] = err.msg;
        });
        setProfileErrors(validationErrs);
      }
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (payload) => {
    setSaving(true);
    try {
      if (editingTask) {
        await tasksAPI.update(editingTask._id, payload);
        toast.success('Task updated!');
      } else {
        await tasksAPI.create(payload);
        toast.success('Task created!');
      }
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const { data } = await tasksAPI.toggleStatus(task._id);
      toast.success(data.message);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update task status.');
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteTarget(task);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tasksAPI.delete(deleteTarget._id);
      toast.success('Task deleted!');
      setDeleteTarget(null);
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const hasFilters = search.trim() !== '' || statusFilter !== 'all';
  const timeGreeting = getTimeGreeting();

  const productivityPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="app-container" id="dashboard-app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab === 'profile' ? 'profile' : statusFilter} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <>
            {/* Top Toolbar Header */}
            <div className="toolbar-header">
              <div className="greeting-section">
                <span className="greeting-subtitle">{timeGreeting}, {user?.name || 'User'}</span>
                <h1 className="greeting-title">My Tasks</h1>
                
                {/* Live Date & Time clock panel */}
                <div className="live-clock-container" title="Current system time">
                  <span className="live-date">{formattedDate}</span>
                  <span className="live-time-divider">|</span>
                  <span className="live-time">{formattedTime}</span>
                </div>
              </div>

              <div className="toolbar-actions">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    id="search-input"
                    aria-label="Search tasks"
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleAddTask}
                  id="add-task-header-btn"
                  title="Add a new task"
                >
                  <Plus size={16} />
                  <span>Add task</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="stats-bar" id="stats-bar">
              <div className="stat-card total" onClick={() => setStatusFilter('all')} style={{ cursor: 'pointer' }}>
                <div className="stat-label">Total Tasks</div>
                <div className="stat-value">{stats.total}</div>
              </div>
              <div className="stat-card today" onClick={() => setStatusFilter('today')} style={{ cursor: 'pointer' }}>
                <div className="stat-label">Today's Tasks</div>
                <div className="stat-value">{stats.today}</div>
              </div>
              <div className="stat-card pending" onClick={() => setStatusFilter('pending')} style={{ cursor: 'pointer' }}>
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
              <div className="stat-card completed" onClick={() => setStatusFilter('completed')} style={{ cursor: 'pointer' }}>
                <div className="stat-label">Completed</div>
                <div className="stat-value">{stats.completed}</div>
              </div>
            </div>

            {/* Filter Pills Tabs */}
            <div className="filter-tabs-wrapper">
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                  id="filter-pill-all"
                >
                  All
                </button>
                <button
                  className={`filter-tab ${statusFilter === 'today' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('today')}
                  id="filter-pill-today"
                >
                  Today
                </button>
                <button
                  className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('pending')}
                  id="filter-pill-pending"
                >
                  Pending
                </button>
                <button
                  className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('completed')}
                  id="filter-pill-completed"
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Tasks Section */}
            {loading ? (
              <div className="loading-page">
                <div className="loading-spinner" />
              </div>
            ) : tasks.length === 0 ? (
              <EmptyState onAddTask={handleAddTask} hasFilters={hasFilters} />
            ) : (
              <>
                {/* Tasks grid with scroll-reveal animations */}
                <div className="tasks-grid" id="tasks-grid">
                  {tasks.map((task) => (
                    <div key={task._id} className="scroll-reveal">
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onToggle={handleToggleStatus}
                        onDelete={handleDeleteClick}
                      />
                    </div>
                  ))}
                </div>

                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        ) : (
          /* Profile Statistics View */
          <div className="profile-view-section">
            <div className="greeting-section">
              <span className="greeting-subtitle">Your productivity hub</span>
              <h1 className="greeting-title">User Profile</h1>
              <div className="live-clock-container" title="Current system time">
                <span className="live-date">{formattedDate}</span>
                <span className="live-time-divider">|</span>
                <span className="live-time">{formattedTime}</span>
              </div>
            </div>

            <div className="profile-card">
              {!isEditingProfile ? (
                <>
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {getInitials(user?.name)}
                    </div>
                    <div className="profile-user-details">
                      <h2>{user?.name || 'User'}</h2>
                      <p>{user?.email || ''}</p>
                    </div>
                    <div className="profile-actions-wrapper">
                      <button
                        className="btn btn-secondary"
                        onClick={handleStartEditProfile}
                        id="edit-profile-btn"
                      >
                        Edit Profile
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setShowLogoutConfirm(true)}
                        id="profile-logout-btn"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Productivity Stats Grid */}
                  <div className="profile-stats-grid">
                    <div className="profile-stat-box">
                      <div className="profile-stat-num total">{stats.total}</div>
                      <div className="profile-stat-desc">Total Created</div>
                    </div>
                    <div className="profile-stat-box">
                      <div className="profile-stat-num pending">{stats.pending}</div>
                      <div className="profile-stat-desc">Tasks Pending</div>
                    </div>
                    <div className="profile-stat-box">
                      <div className="profile-stat-num completed">{stats.completed}</div>
                      <div className="profile-stat-desc">Tasks Completed</div>
                    </div>
                  </div>

                  {/* Productivity rate */}
                  <div className="profile-productivity">
                    <div className="productivity-header">
                      <span>Productivity Score</span>
                      <span className="productivity-percentage">{productivityPercentage}%</span>
                    </div>
                    <div className="progress-track" title={`${productivityPercentage}% tasks completed`}>
                      <div className="progress-bar" style={{ width: `${productivityPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Recharts Productivity Chart */}
                  <div className="profile-chart-container" style={{ marginTop: 'var(--space-8)', width: '100%', height: '250px' }}>
                    <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Task Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: stats.completed },
                            { name: 'Pending', value: stats.pending }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="cell-0" fill="var(--color-green)" />
                          <Cell key="cell-1" fill="var(--color-indigo)" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-card)', 
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            color: 'var(--color-text-primary)'
                          }} 
                          itemStyle={{ color: 'var(--color-text-primary)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <div className="profile-edit-header">
                    <h2>Edit Account Details</h2>
                    <p className="profile-edit-subtitle">Update email address and change password securely.</p>
                  </div>

                  <div className="profile-form-body">
                    {/* Email */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="edit-email">Email Address</label>
                      <input
                        type="email"
                        id="edit-email"
                        className={`form-input ${profileErrors.email ? 'error' : ''}`}
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                      {profileErrors.email && (
                        <span className="form-error">
                          <AlertTriangle size={12} /> {profileErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Current Password */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="current-password">Current Password (Required)</label>
                      <input
                        type="password"
                        id="current-password"
                        className={`form-input ${profileErrors.currentPassword ? 'error' : ''}`}
                        placeholder="Enter current password to verify identity"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      {profileErrors.currentPassword && (
                        <span className="form-error">
                          <AlertTriangle size={12} /> {profileErrors.currentPassword}
                        </span>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="new-password">New Password (Optional)</label>
                      <input
                        type="password"
                        id="new-password"
                        className={`form-input ${profileErrors.newPassword ? 'error' : ''}`}
                        placeholder="Enter at least 6 characters if you want to change it"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                      {profileErrors.newPassword && (
                        <span className="form-error">
                          <AlertTriangle size={12} /> {profileErrors.newPassword}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={updatingProfile}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updatingProfile}
                    >
                      {updatingProfile && <span className="spinner" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal Overlay */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        loading={saving}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)} id="delete-confirm-overlay">
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-icon">
              <AlertTriangle size={24} />
            </div>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete "{deleteTarget.title}"? This will permanently remove it from your workspace.</p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                id="delete-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                id="delete-confirm-btn"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="confirm-overlay" onClick={() => setShowLogoutConfirm(false)} id="profile-logout-confirm-overlay">
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
                id="profile-logout-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                id="profile-logout-confirm-btn"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
