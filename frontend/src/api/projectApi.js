import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

/**
 * Fetch all projects with optional server-side search, filter, sort and pagination.
 * @param {Object} opts
 * @param {string}  opts.search     - Title / description search term
 * @param {string}  opts.technology - Single technology filter (e.g. "React")
 * @param {string}  opts.sort       - "newest" | "oldest" | "title"
 * @param {number}  opts.page       - Page number (1-indexed)
 * @param {number}  opts.limit      - Results per page
 */
export const getProjects = (opts = {}) => {
  const params = {}
  if (opts.search)     params.search = opts.search
  if (opts.technology && opts.technology !== 'All') params.technology = opts.technology
  if (opts.sort)       params.sort = opts.sort
  if (opts.page)       params.page = opts.page
  if (opts.limit)      params.limit = opts.limit
  return apiClient.get('/projects', { params }).then(unwrap)
}

export const getProject = (id) => apiClient.get(`/projects/${id}`).then(unwrap)
export const createProject = (payload) => apiClient.post('/projects', payload).then(unwrap)
export const updateProject = (id, payload) => apiClient.put(`/projects/${id}`, payload).then(unwrap)
export const deleteProject = (id) => apiClient.delete(`/projects/${id}`).then(unwrap)
export const getMyProjects = () => apiClient.get('/projects/me').then(unwrap)

