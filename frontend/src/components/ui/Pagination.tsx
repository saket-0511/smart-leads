import { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const btnClass = (disabled: boolean) =>
    `px-3 py-1.5 text-sm border rounded-lg transition ${
      disabled
        ? 'border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600 cursor-not-allowed'
        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{from}–{to}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> leads
      </p>
      <div className="flex items-center gap-2">
        <button disabled={!hasPrevPage} onClick={() => onPageChange(page - 1)} className={btnClass(!hasPrevPage)}>
          ← Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
          {page} / {totalPages}
        </span>
        <button disabled={!hasNextPage} onClick={() => onPageChange(page + 1)} className={btnClass(!hasNextPage)}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
