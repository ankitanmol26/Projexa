import axios from 'axios'
import { API_BASE_URL } from './config.js'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
