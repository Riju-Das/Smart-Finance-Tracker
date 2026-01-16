import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface TransactionPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

function TransactionPagination({ pagination, onPageChange }: TransactionPaginationProps) {
  const { currentPage, totalPages, totalRecords, pageSize, hasNextPage, hasPreviousPage } = pagination;

  if (totalRecords === 0) return null;


  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="py-8 flex justify-center">

      <button
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-sm transition-colors
              ${hasPreviousPage
            ? 'hover:bg-white/10 cursor-pointer text-white'
            : 'opacity-50 cursor-not-allowed text-gray-500'}`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>


      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => (
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                    ${currentPage === page
                  ? 'bg-white text-black'
                  : 'border border-white/10 text-white hover:bg-white/10'}`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-sm transition-colors
              ${hasNextPage
            ? 'hover:bg-white/10 cursor-pointer text-white'
            : 'opacity-50 cursor-not-allowed text-gray-500'}`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default TransactionPagination;
