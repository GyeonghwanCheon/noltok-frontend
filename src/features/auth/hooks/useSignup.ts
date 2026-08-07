import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { SignupRequest, SignupResponse } from '@/features/auth/types'

async function signup(request: SignupRequest) {
  const { data } = await apiClient.post<ApiResponse<SignupResponse>>(
    '/api/v1/auth/signup',
    request,
  )
  return data.data
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  })
}
