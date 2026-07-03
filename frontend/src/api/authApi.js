import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const register = (payload) => apiClient.post('/auth/register', payload).then(unwrap)
export const login = (payload) => apiClient.post('/auth/login', payload).then(unwrap)
export const getMe = () => apiClient.get('/auth/me').then(unwrap)
export const updateMe = (payload) => apiClient.put('/auth/profile', payload).then(unwrap)
