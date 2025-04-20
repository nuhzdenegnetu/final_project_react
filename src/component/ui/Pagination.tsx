import React, { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: 'purple' | 'blue'; // Color theme
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  color = 'purple'
}) => {
  const baseButtonClass = `px-3 py-1 rounded-md text-sm font-medium transition-colors focus:outline-none`;
  const activeButtonClass = color === 'purple' 
    ? `bg-purple-600 text-white hover:bg-purple-700` 
    : `bg-blue-600 text-white hover:bg-blue-700`;
  const inactiveButtonClass = `bg-gray-700 text-gray-300 hover:bg-gray-600`;
  const disabledButtonClass = `bg-gray-800 text-gray-500 cursor-not-allowed`;
  
  // Memoize the page numbers calculation to prevent recalculation on every render
  const pageNumbers = useMemo(() => {
    const result = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      // Show subset of pages with ... for larger sets
      if (currentPage <= 3) {
        // Near start: show first 4 pages + last page
        for (let i = 1; i <= 4; i++) {
          result.push(i);
        }
        result.push('ellipsis');
        result.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show first page + last 4 pages
        result.push(1);
        result.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          result.push(i);
        }
      } else {
        // Middle: show first page + current-1, current, current+1 + last page
        result.push(1);
        result.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          result.push(i);
        }
        result.push('ellipsis');
        result.push(totalPages);
      }
    }
    
    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledButtonClass : inactiveButtonClass}`}
        aria-label="Previous page"
      >
        &laquo;
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={`${baseButtonClass} ${inactiveButtonClass}`}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`${baseButtonClass} ${currentPage === page ? activeButtonClass : inactiveButtonClass}`}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}`}
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
}; 