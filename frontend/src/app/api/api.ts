import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // MUITO IMPORTANTE pros cookies irem junto
})

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Try to refresh the token using the refresh endpoint
        const { data } = await axios.post(
          'http://localhost:4000/auth/refresh',
          {},
          { withCredentials: true },
        )
        // Save new token
        localStorage.setItem('token', data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        error.config.headers['Authorization'] = `Bearer ${data.token}`
        return api(error.config) // Retry the original request
      } catch (err) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
        console.error('Token refresh failed:', err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
