import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        dueDate: ''
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate || null
    };

    onSave(payload);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} id="task-modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()} id="task-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
            id="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title</label>
              <input
                type="text"
                id="task-title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                autoFocus
              />
              {errors.title && (
                <span className="form-error">
                  <AlertCircle size={12} />
                  {errors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-description">
                Description <span style={{ color: 'var(--color-navy-400)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="task-description"
                className={`form-input ${errors.description ? 'error' : ''}`}
                placeholder="Add some details..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
              {errors.description && (
                <span className="form-error">
                  <AlertCircle size={12} />
                  {errors.description}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date">
                Due Date <span style={{ color: 'var(--color-navy-400)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="date"
                id="task-due-date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
              id="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="modal-save-btn"
            >
              {loading && <span className="spinner" />}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
