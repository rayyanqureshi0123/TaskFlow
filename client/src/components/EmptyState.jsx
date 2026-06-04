import { ClipboardList } from 'lucide-react';

const EmptyState = ({ onAddTask, hasFilters }) => {
  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-state-icon">
        <ClipboardList size={36} />
      </div>

      {hasFilters ? (
        <>
          <h3>No tasks found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </>
      ) : (
        <>
          <h3>No tasks yet</h3>
          <p>Get started by creating your first task. Stay organized and track your progress effortlessly.</p>
          <button
            className="btn btn-primary"
            onClick={onAddTask}
            id="empty-add-task-btn"
          >
            Create your first task
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
