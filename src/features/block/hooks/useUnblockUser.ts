import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { UnblockResponse } from '@/features/block/types'

async function unblockUser(blockId: number) {
  const { data } = await apiClient.delete<ApiResponse<UnblockResponse>>(`/api/v1/blocks/${blockId}`)
  return data.data
}

export function useUnblockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] })
    },
  })
}
