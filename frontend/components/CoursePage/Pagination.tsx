import React from 'react';
import { Icon } from '@/ui/icons';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNextPage = () =>
    onPageChange(Math.min(currentPage + 1, totalPages));
  const handleLastPage = () => onPageChange(totalPages);

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md',
          currentPage === 1
            ? 'cursor-not-allowed border-secondary-300 text-secondary-500'
            : 'border-secondary-700 text-black hover:bg-secondary-100',
        )}
        aria-label="First page"
      >
        <Icon name="chevron-first" size={36} />
      </button>

      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md',
          currentPage === 1
            ? 'cursor-not-allowed border-secondary-300 text-secondary-500'
            : 'border-secondary-700 text-black hover:bg-secondary-100',
        )}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={36} />
      </button>

      <div className="flex items-center">
        <span className="text-p">第</span>
        <div className="mx-2 flex h-10 w-10 items-center justify-center rounded-md border border-black">
          <span className="text-p">{currentPage}</span>
        </div>
        <span className="text-p">頁，共 {totalPages} 頁</span>
      </div>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md',
          currentPage === totalPages
            ? 'cursor-not-allowed border-secondary-300 text-secondary-500'
            : 'border-secondary-700 text-black hover:bg-secondary-100',
        )}
        aria-label="Next page"
      >
        <Icon name="chevron-right" size={36} />
      </button>

      <button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-md',
          currentPage === totalPages
            ? 'cursor-not-allowed border-secondary-300 text-secondary-500'
            : 'border-secondary-700 text-black hover:bg-secondary-100',
        )}
        aria-label="Last page"
      >
        <Icon name="chevron-last" size={36} />
      </button>
    </div>
  );
};
