import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const toggleLike = (projectId) =>
  apiClient.post(`/likes/${projectId}`).then(unwrap)

export const getLikeStatus = (projectId) =>
  apiClient.get(`/likes/${projectId}/me`).then(unwrap)
