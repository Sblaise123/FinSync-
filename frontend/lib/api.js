import axios from 'axios'

export const API_BASE_URL = 'https://finsync-gu32.onrender.com'  // replace with your actual Render URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const accountsAPI = {
  getAccounts: () => api.get('/accounts/'),
  createAccount: (data) => api.post('/accounts/', data),
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
}

export const transactionsAPI = {
  getTransactions: (params) => api.get('/transactions/', { params }),
  createTransaction: (data) => api.post('/transactions/', data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getStats: (params) => api.get('/transactions/stats', { params }),
  getCategoryStats: (params) => api.get('/transactions/category-stats', { params }),
  getMonthly: (params) => api.get('/transactions/monthly', { params }),
}

export default api