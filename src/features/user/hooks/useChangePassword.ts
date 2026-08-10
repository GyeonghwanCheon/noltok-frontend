import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ChangePasswordRequest } from '@/features/user/types'

async function changePassword(request: ChangePasswordRequest) {
  await apiClient.patch('/api/v1/users/me/password', request)
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}
