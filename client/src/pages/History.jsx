import { useState, useEffect } from 'react';
import { userAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getHistory({ limit: 20 });
      setHistory(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Investigation History</h1>

        {history && history.investigations.length > 0 ? (
          <div className="space-y-4">
            {history.investigations.map((inv) => (
              <div
                key={inv._id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {inv.caseId?.title || 'Unknown Case'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {inv.caseId?.shortDescription}
                    </p>
                    <div className="flex gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {inv.caseId?.difficulty}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {inv.caseId?.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        inv.status === 'COMPLETED'
                          ? 'text-green-400'
                          : inv.status === 'ABANDONED'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {inv.status}
                    </div>
                    {inv.status === 'COMPLETED' && inv.score && (
                      <div className="text-sm text-gray-400 mt-1">
                        Score: {inv.score.total}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-4">
                  <div>
                    Attempt #{inv.attemptNumber} | Started:{' '}
                    {new Date(inv.startedAt).toLocaleDateString()}
                  </div>
                  {inv.status === 'COMPLETED' && (
                    <div>
                      Completed:{' '}
                      {new Date(inv.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              No investigations yet
            </h3>
            <p className="text-gray-400 mb-4">
              Start investigating cases to build your history
            </p>
            <button
              onClick={() => navigate('/cases')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Cases
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
