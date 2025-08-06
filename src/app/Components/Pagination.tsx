interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNext, hasPrev, total } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show 5 page numbers at most
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, total);

  return (
    <div className="PaginationContainer flex flex-col items-center gap-4 py-4">
      <div className="PaginationInfo text-sm text-gray-600">
        Showing {startItem}-{endItem} of {total} restaurants
      </div>
      
      <div className="PaginationControls flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="PaginationButton px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>

        {generatePageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : undefined}
            disabled={typeof pageNum === 'string'}
            className={`PaginationButton px-3 py-1 rounded border ${
              pageNum === page 
                ? 'bg-stone-800 text-white' 
                : typeof pageNum === 'string'
                ? 'bg-transparent border-none cursor-default'
                : 'hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="PaginationButton px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}