import { Check, Circle, Pencil, Trash2, Calendar } from 'lucide-react';

const TaskCard = ({ task, onEdit, onToggle, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && !isCompleted;
  };

  return (
    <div
      className={`task-card ${isCompleted ? 'completed' : ''}`}
      id={`task-${task._id}`}
      style={{ animationDelay: `${Math.random() * 0.1}s` }}
    >
      <div className="task-card-header">
        <div className="task-card-left">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-card-footer">
        <div className="task-meta">
          <span className={`task-badge ${task.status}`}>
            {isCompleted ? (
              <Check size={12} />
            ) : (
              <Circle size={12} />
            )}
            {task.status}
          </span>
          {task.dueDate && (
            <span className={`task-due ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
              <Calendar size={12} />
              {isOverdue(task.dueDate) ? 'Overdue · ' : ''}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => onToggle(task)}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            id={`toggle-${task._id}`}
          >
            {isCompleted ? <Circle size={18} /> : <Check size={18} />}
          </button>
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            id={`edit-${task._id}`}
          >
            <Pencil size={18} />
          </button>
          <button
            className="btn-icon danger"
            onClick={() => onDelete(task)}
            title="Delete task"
            id={`delete-${task._id}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
