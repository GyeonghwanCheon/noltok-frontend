import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { DeleteAccountResponse } from '@/features/user/types'

async function deleteAccount() {
  const { data } = await apiClient.delete<ApiResponse<DeleteAccountResponse>>('/api/v1/users/me')
  return data.data
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  })
}
