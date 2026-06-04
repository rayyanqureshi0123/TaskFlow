import { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, Search, CheckCircle2, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { tasksAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Tab State ('dashboard' or 'profile')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Task state
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  // Live Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Track live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format dates and time
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

  // Scroll-Reveal Animation setup
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

  // Get dynamic time-based greeting
  const getTimeGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8, // Fit nicely in 2-column grid
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined
      };

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

  // Fetch stats (unfiltered counts)
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, pendingRes, completedRes] = await Promise.all([
        tasksAPI.getAll({ limit: 1 }),
        tasksAPI.getAll({ limit: 1, status: 'pending' }),
        tasksAPI.getAll({ limit: 1, status: 'completed' })
      ]);
      setStats({
        total: allRes.data.pagination.total,
        pending: pendingRes.data.pagination.total,
        completed: completedRes.data.pagination.total
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Handle Sidebar Tab Swaps (reusing tab filter routes)
  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      setActiveTab('dashboard');
      setStatusFilter('all');
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

  // Handlers
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

  // Productivity Score Calculation
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
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {getInitials(user?.name)}
                </div>
                <div className="profile-user-details">
                  <h2>{user?.name || 'User'}</h2>
                  <p>{user?.email || ''}</p>
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
    </div>
  );
};

export default Dashboard;
