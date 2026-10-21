import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    // For state-changing methods, add CSRF token from meta tag
    if (
      ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())
    ) {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Auth API
 */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

/**
 * Case API
 */
export const caseAPI = {
  getCases: (params) => api.get('/cases', { params }),
  getCaseBySlug: (slug) => api.get(`/cases/${slug}`),
};

/**
 * Investigation API
 */
export const investigationAPI = {
  createInvestigation: (caseId) => api.post('/investigations', { caseId }),
  getInvestigation: (id) => api.get(`/investigations/${id}`),
  getInvestigationsForCase: (caseId) =>
    api.get(`/investigations/case/${caseId}`),
  getUserInvestigations: () => api.get('/investigations'),
  updateInvestigation: (id, data) => api.put(`/investigations/${id}`, data),
  discoverEvidence: (id, evidenceId) =>
    api.post(`/investigations/${id}/discover`, { evidenceId }),
  abandonInvestigation: (id) => api.post(`/investigations/${id}/abandon`),
  saveBoard: (id, board) => api.put(`/investigations/${id}/board`, { board }),
  getBoard: (id) => api.get(`/investigations/${id}/board`),
  submitConclusion: (id, data) =>
    api.post(`/investigations/${id}/conclusion`, data),
  getScore: (id) => api.get(`/investigations/${id}/score`),
};

/**
 * User API
 */
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getHistory: (params) => api.get('/users/history', { params }),
  getAchievements: () => api.get('/users/achievements'),
  getLeaderboard: (params) => api.get('/users/leaderboard', { params }),
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
