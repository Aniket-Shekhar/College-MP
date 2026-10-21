import { useState, useEffect } from 'react';
import { userAPI } from '../lib/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data.data.user);
      setStats(response.data.data.stats);
      setAvatarUrl(response.data.data.user.avatarUrl || '');
      setLeaderboardVisible(response.data.data.user.leaderboardVisible);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile({ avatarUrl, leaderboardVisible });
      setEditing(false);
      loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to update profile'
      );
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
        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        {profile && (
          <div className="space-y-8">
            {/* User Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">User Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="leaderboardVisible"
                      checked={leaderboardVisible}
                      onChange={(e) => setLeaderboardVisible(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <label htmlFor="leaderboardVisible" className="text-sm">
                      Show on leaderboard
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Username:</span>{' '}
                    <span className="font-semibold">{profile.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>{' '}
                    <span className="font-semibold">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Role:</span>{' '}
                    <span className="font-semibold">{profile.role}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Leaderboard:</span>{' '}
                    <span className="font-semibold">
                      {profile.leaderboardVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            {stats && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {stats.totalAttempts}
                    </div>
                    <div className="text-sm text-gray-400">Total Attempts</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {stats.completedAttempts}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      {stats.averageScore}
                    </div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {stats.highestScore}
                    </div>
                    <div className="text-sm text-gray-400">Highest Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
