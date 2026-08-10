import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendRejectResponse } from '@/features/friend/types'

async function rejectFriendRequest(friendId: number) {
  const { data } = await apiClient.patch<ApiResponse<FriendRejectResponse>>(
    `/api/v1/friends/${friendId}/reject`,
  )
  return data.data
}

export function useRejectFriendRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'received'] })
    },
  })
}
