import { Search } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' }
];

const SearchBar = ({ search, onSearchChange, statusFilter, onFilterChange }) => {
  return (
    <div className="toolbar" id="toolbar">
      <div className="toolbar-left">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-input"
            aria-label="Search tasks"
          />
        </div>

        <div className="filter-tabs" id="filter-tabs">
          {FILTERS.map(filter => (
            <button
              key={filter.key}
              className={`filter-tab ${statusFilter === filter.key ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.key)}
              id={`filter-${filter.key}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
