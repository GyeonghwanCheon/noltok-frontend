import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { BlockResponse } from '@/features/block/types'

async function blockUser(nickname: string) {
  const { data } = await apiClient.post<ApiResponse<BlockResponse>>('/api/v1/blocks', { nickname })
  return data.data
}

export function useBlockUser() {
  return useMutation({
    mutationFn: blockUser,
  })
}
