import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

let logoutHandler = null

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export const registerUnauthorizedHandler = (callback) => {
  logoutHandler = callback
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutHandler?.()
    }
    return Promise.reject(error)
  },
)

export default apiClient
