import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendAcceptResponse } from '@/features/friend/types'

async function acceptFriendRequest(friendId: number) {
  const { data } = await apiClient.patch<ApiResponse<FriendAcceptResponse>>(
    `/api/v1/friends/${friendId}/accept`,
  )
  return data.data
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'received'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })
}
