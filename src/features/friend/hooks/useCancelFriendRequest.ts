import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendCancelResponse } from '@/features/friend/types'

async function cancelFriendRequest(friendId: number) {
  const { data } = await apiClient.delete<ApiResponse<FriendCancelResponse>>(
    `/api/v1/friends/${friendId}/cancel`,
  )
  return data.data
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'sent'] })
    },
  })
}
