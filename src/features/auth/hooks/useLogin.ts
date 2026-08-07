import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { setTokens } from '@/features/auth/tokenStorage'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, LoginResponse } from '@/features/auth/types'

async function login(request: LoginRequest) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', request)
  return data.data
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
    },
  })
}
