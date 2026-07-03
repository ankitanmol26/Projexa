import { useMemo } from 'react'
import apiClient from '../api/axios.js'

export default function useAxios() {
  return useMemo(() => apiClient, [])
}
