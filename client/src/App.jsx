import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import Investigation from './pages/Investigation';
import EvidenceBoard from './pages/EvidenceBoard';
import Conclusion from './pages/Conclusion';
import Profile from './pages/Profile';
import History from './pages/History';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import AdminCases from './pages/AdminCases';

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CASEFILE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/cases" className="text-gray-700 hover:text-gray-900">
                Cases
              </a>
              <a href="/history" className="text-gray-700 hover:text-gray-900">
                History
              </a>
              <a
                href="/achievements"
                className="text-gray-700 hover:text-gray-900"
              >
                Achievements
              </a>
              <a
                href="/leaderboard"
                className="text-gray-700 hover:text-gray-900"
              >
                Leaderboard
              </a>
              <a href="/profile" className="text-gray-700 hover:text-gray-900">
                Profile
              </a>
              {user?.role === 'ADMIN' && (
                <a
                  href="/admin/cases"
                  className="text-red-700 hover:text-red-900 font-semibold"
                >
                  Admin
                </a>
              )}
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to CASEFILE
          </h2>
          <p className="text-gray-600 mb-6">
            Interactive Crime Scene Investigation Platform
          </p>
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">Authentication Status</p>
              <p>You are logged in as: {user?.username}</p>
              <p>Email: {user?.email}</p>
              <p>Role: {user?.role}</p>
            </div>
            <a
              href="/cases"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 text-center"
            >
              Browse Cases
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <Cases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:slug"
        element={
          <ProtectedRoute>
            <CaseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investigate/:slug"
        element={
          <ProtectedRoute>
            <Investigation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investigations/:id/board"
        element={
          <ProtectedRoute>
            <EvidenceBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investigations/:id/conclusion"
        element={
          <ProtectedRoute>
            <Conclusion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cases"
        element={
          <AdminRoute>
            <AdminCases />
          </AdminRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
