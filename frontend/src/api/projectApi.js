import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const getProjects = () => apiClient.get('/projects').then(unwrap)
export const getProject = (id) => apiClient.get(`/projects/${id}`).then(unwrap)
export const createProject = (payload) => apiClient.post('/projects', payload).then(unwrap)
export const updateProject = (id, payload) => apiClient.put(`/projects/${id}`, payload).then(unwrap)
export const deleteProject = (id) => apiClient.delete(`/projects/${id}`).then(unwrap)
export const getMyProjects = () => apiClient.get('/projects/me').then(unwrap)
