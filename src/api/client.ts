import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/features/auth/tokenStorage'
import type { ApiResponse } from '@/types/api'
import type { LoginResponse } from '@/features/auth/types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const NO_RETRY_PATHS = ['/api/v1/auth/login', '/api/v1/auth/reissue', '/api/v1/auth/signup']

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const isAuthEndpoint = NO_RETRY_PATHS.some((path) => originalRequest?.url?.includes(path))

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/reissue', {
        refreshToken,
      })
      setTokens(data.data.accessToken, data.data.refreshToken)
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
      return apiClient(originalRequest)
    } catch (reissueError) {
      clearTokens()
      return Promise.reject(reissueError)
    }
  },
)
