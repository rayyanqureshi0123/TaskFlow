import { Pencil, Trash2, Calendar, Check, RotateCcw } from 'lucide-react';

const TaskCard = ({ task, onEdit, onToggle, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const isOverdue = (dateStr, timeStr) => {
    if (!dateStr) return false;
    let dueDateTime;
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      dueDateTime = new Date(dateStr);
      dueDateTime.setHours(hours, minutes, 0, 0);
    } else {
      // Set hours to 23:59:59 to give users the full day to finish
      dueDateTime = new Date(dateStr);
      dueDateTime.setHours(23, 59, 59, 999);
    }
    return dueDateTime.getTime() < new Date().getTime() && !isCompleted;
  };

  return (
    <div
      className={`task-card ${task.status}`}
      id={`task-${task._id}`}
      style={{ animationDelay: `${Math.random() * 0.15}s` }}
    >
      <div className="task-card-main">
        {/* Card Header */}
        <div className="task-card-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`status-badge ${task.status}`}>
            {task.status}
          </span>
        </div>

        {/* Card Description */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      {/* Card Footer */}
      <div className="task-card-footer">
        <div className="task-meta">
          {task.dueDate && (
            <span className={`task-due ${isOverdue(task.dueDate, task.dueTime) ? 'overdue' : ''}`}>
              <Calendar size={12} style={{ marginRight: '4px' }} />
              {isOverdue(task.dueDate, task.dueTime) ? 'Overdue · ' : ''}
              {formatDate(task.dueDate)}
              {task.dueTime && ` at ${formatTime(task.dueTime)}`}
            </span>
          )}
        </div>

        {/* Action Panel */}
        <div className="task-actions">
          {/* Toggle Done/Undo Button */}
          <button
            className={`btn-toggle-status ${task.status}`}
            onClick={() => onToggle(task)}
            title={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
            id={`toggle-${task._id}`}
          >
            {isCompleted ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={12} /> Undo
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Done
              </span>
            )}
          </button>

          {/* Edit Button */}
          <button
            className="btn-square"
            onClick={() => onEdit(task)}
            title="Edit task details"
            id={`edit-${task._id}`}
            aria-label="Edit task"
          >
            <Pencil size={13} />
          </button>

          {/* Delete Button */}
          <button
            className="btn-square danger"
            onClick={() => onDelete(task)}
            title="Delete task"
            id={`delete-${task._id}`}
            aria-label="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
