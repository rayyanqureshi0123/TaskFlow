import { useState, useEffect, useCallback } from 'react';
import { Plus, ListChecks, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { tasksAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
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

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = search.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="dashboard" id="dashboard">
      <Navbar />

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-bar" id="stats-bar">
          <div className="stat-card total">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {/* Task List */}
        {loading ? (
          <div className="loading-page" style={{ minHeight: '200px' }}>
            <div className="loading-spinner" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onAddTask={handleAddTask} hasFilters={hasFilters} />
        ) : (
          <>
            <div className="task-list" id="task-list">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onToggle={handleToggleStatus}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* FAB */}
      <button
        className="fab"
        onClick={handleAddTask}
        title="Add new task"
        id="add-task-fab"
        aria-label="Add new task"
      >
        <Plus size={24} />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        loading={saving}
      />

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)} id="delete-confirm">
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-icon">
              <AlertTriangle size={24} />
            </div>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete "{deleteTarget.title}"? This action cannot be undone.</p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                id="delete-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmDelete}
                id="delete-confirm-btn"
                style={{
                  background: 'linear-gradient(135deg, var(--color-red-500), var(--color-red-600))',
                  boxShadow: '0 1px 3px rgba(220, 38, 38, 0.3)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
