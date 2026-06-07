import { useState, useEffect } from 'react';
import { X, AlertCircle, ChevronDown } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
    dueTime: ''
  });
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        dueTime: task.dueTime || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        dueDate: '',
        dueTime: ''
      });
    }
    setErrors({});
    setDropdownOpen(false);
  }, [task, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownOpen && !e.target.closest('.custom-select-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

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
      dueDate: formData.dueDate || null,
      dueTime: formData.dueTime || null
    };

    onSave(payload);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

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
                Description <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>(optional)</span>
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

            {/* Status Custom Dropdown Select */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <div className="custom-select-container">
                <button
                  type="button"
                  id="task-status"
                  className="custom-select-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <span className="custom-select-value">
                    <span className={`select-indicator-dot ${formData.status}`} />
                    {formData.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="custom-select-options" role="listbox">
                    <button
                      type="button"
                      className={`custom-select-option ${formData.status === 'pending' ? 'selected' : ''}`}
                      role="option"
                      aria-selected={formData.status === 'pending'}
                      onClick={() => {
                        handleChange('status', 'pending');
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="select-indicator-dot pending" />
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`custom-select-option ${formData.status === 'completed' ? 'selected' : ''}`}
                      role="option"
                      aria-selected={formData.status === 'completed'}
                      onClick={() => {
                        handleChange('status', 'completed');
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="select-indicator-dot completed" />
                      Completed
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Due Date & Time (Row layout) */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="task-due-date">
                  Due Date <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="date"
                  id="task-due-date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="task-due-time">
                  Due Time <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="time"
                    id="task-due-time"
                    className="form-input"
                    value={formData.dueTime}
                    onChange={(e) => handleChange('dueTime', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {/* Visual AM/PM indicator for clarity */}
                  {formData.dueTime && (
                    <span className="ampm-indicator" style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-sidebar)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)'
                    }}>
                      {parseInt(formData.dueTime.split(':')[0], 10) >= 12 ? 'PM' : 'AM'}
                    </span>
                  )}
                </div>
              </div>
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
