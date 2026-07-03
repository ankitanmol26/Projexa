import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest, register as registerRequest, getMe, updateMe as updateMeRequest } from '../api/authApi.js'
import { registerUnauthorizedHandler, setAuthToken } from '../api/axios.js'
import * as storage from '../utils/storage.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Track whether we already have a user so we skip the getMe() re-fetch
  const skipNextTokenEffect = useRef(false)

  const logout = useCallback(() => {
    setUser(null)
    storage.removeToken()
    setAuthToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  // Register the global 401 handler once
  useEffect(() => {
    registerUnauthorizedHandler(logout)
  }, [logout])

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = storage.getToken()

    if (!storedToken) {
      setLoading(false)
      return
    }

    setAuthToken(storedToken)

    const restoreSession = async () => {
      try {
        const profile = await getMe()
        setUser(profile)
      } catch {
        // Token is invalid / expired — clear it
        storage.removeToken()
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run ONCE on mount only

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials)

    // Backend returns ApiResponse: { success, statusCode, message, data: { user, token } }
    // authApi unwrap() peels off .data → response here is { user, token }
    const accessToken = response?.token ?? response?.data?.token
    const currentUser = response?.user ?? response?.data?.user

    if (!accessToken) {
      throw new Error('Login failed: no token received from server.')
    }

    storage.setToken(accessToken)
    setAuthToken(accessToken)
    setUser(currentUser)
    return currentUser
  }, [])

  const register = useCallback(async (data) => {
    const response = await registerRequest(data)

    const accessToken = response?.token ?? response?.data?.token
    const currentUser = response?.user ?? response?.data?.user

    if (!accessToken) {
      throw new Error('Registration failed: no token received from server.')
    }

    storage.setToken(accessToken)
    setAuthToken(accessToken)
    setUser(currentUser)
    return currentUser
  }, [])

  const updateProfile = useCallback(async (data) => {
    const response = await updateMeRequest(data)
    const currentUser = response?.user ?? response?.data?.user ?? response
    setUser(currentUser)
    return currentUser
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
