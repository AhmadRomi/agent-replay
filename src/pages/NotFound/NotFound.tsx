
import { Link, useNavigate } from 'react-router-dom';
import { ERoutes } from '../../constants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-8xl font-bold leading-none text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900">Page not found</h2>
      <p className="mb-4 mt-2 max-w-sm text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition hover:bg-gray-50"
        >
          Go back
        </button>
        <Link
          to={ERoutes.DASHBOARD}
          className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm text-white transition hover:bg-gray-800"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;