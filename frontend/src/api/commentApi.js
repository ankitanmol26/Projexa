import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const getComments = (projectId) => apiClient.get(`/comments/project/${projectId}`).then(unwrap)
export const createComment = (projectId, payload) => apiClient.post(`/comments/project/${projectId}`, payload).then(unwrap)
export const updateComment = (commentId, payload) => apiClient.put(`/comments/${commentId}`, payload).then(unwrap)
export const deleteComment = (commentId) => apiClient.delete(`/comments/${commentId}`).then(unwrap)
