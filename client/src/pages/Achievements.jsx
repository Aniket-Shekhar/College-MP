import { useState, useEffect } from 'react';
import { userAPI } from '../lib/api';

export default function Achievements() {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAchievements();
      setAchievements(response.data.data.achievements);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to load achievements'
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
        <h1 className="text-4xl font-bold mb-8">Achievements</h1>

        {achievements && achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gray-800 rounded-lg p-6 border border-yellow-600"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <div className="text-xs text-gray-500">
                        Unlocked:{' '}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
            <p className="text-gray-400">
              Complete investigations to unlock achievements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
