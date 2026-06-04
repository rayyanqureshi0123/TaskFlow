import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      } else if (page >= pages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = pages - 3; i <= pages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="pagination" id="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        id="page-prev"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-info">…</span>
        ) : (
          <button
            key={pageNum}
            className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
            id={`page-${pageNum}`}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        id="page-next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
