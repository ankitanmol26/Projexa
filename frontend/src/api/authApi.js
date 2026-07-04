import apiClient from './axios.js'

const unwrap = (r) => r.data?.data ?? r.data

export const register              = (payload) => apiClient.post('/auth/register', payload).then(unwrap)
export const login                 = (payload) => apiClient.post('/auth/login', payload).then(unwrap)
export const getMe                 = ()         => apiClient.get('/auth/me').then(unwrap)
export const updateMe              = (payload) => apiClient.put('/auth/profile', payload).then(unwrap)
export const changePassword        = (payload) => apiClient.put('/auth/change-password', payload).then(unwrap)
export const forgotPasswordRequest = (payload) => apiClient.post('/auth/forgot-password', payload).then(unwrap)
export const resetPasswordRequest  = (token, payload) => apiClient.post(`/auth/reset-password/${token}`, payload).then(unwrap)
