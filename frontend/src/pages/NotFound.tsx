import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center animate-slide-up">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
