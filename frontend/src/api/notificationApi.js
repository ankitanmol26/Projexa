import apiClient from './axios.js'

export const fetchNotifications = () =>
  apiClient.get('/notifications').then((r) => r.data.data)

export const fetchUnreadCount = () =>
  apiClient.get('/notifications/unread-count').then((r) => r.data.data.count)

export const markNotificationRead = (id) =>
  apiClient.patch(`/notifications/${id}/read`).then((r) => r.data.data)

export const markAllNotificationsRead = () =>
  apiClient.patch('/notifications/read-all')

export const deleteNotification = (id) =>
  apiClient.delete(`/notifications/${id}`)
