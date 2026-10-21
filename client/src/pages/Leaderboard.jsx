import { useState, useEffect } from 'react';
import { userAPI } from '../lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getLeaderboard({ limit: 10 });
      setLeaderboard(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to load leaderboard'
      );
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>

        {leaderboard && leaderboard.leaderboard.length > 0 ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Highest Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Cases Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.leaderboard.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={entry.rank <= 3 ? 'bg-yellow-900/20' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          entry.rank === 1
                            ? 'bg-yellow-500 text-yellow-900'
                            : entry.rank === 2
                              ? 'bg-gray-400 text-gray-900'
                              : entry.rank === 3
                                ? 'bg-orange-600 text-orange-900'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.avatarUrl && (
                          <img
                            src={entry.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <span className="font-semibold">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-400 font-semibold">
                        {entry.highestScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.totalScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.casesCompleted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Leaderboard is empty</h3>
            <p className="text-gray-400">
              Be the first to complete an investigation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
