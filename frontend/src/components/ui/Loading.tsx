interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-brand-500 ${sizes[size]} ${className}`} />
);

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

export const EmptyState = ({ message = 'No leads found', description = 'Try adjusting your filters or create a new lead.' }: { message?: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="text-5xl mb-4">📭</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{message}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="text-5xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold text-red-600">{message}</h3>
    {onRetry && (
      <button onClick={onRetry} className="mt-3 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition">
        Try Again
      </button>
    )}
  </div>
);
