import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendDeleteResponse } from '@/features/friend/types'

async function deleteFriend(friendId: number) {
  const { data } = await apiClient.delete<ApiResponse<FriendDeleteResponse>>(
    `/api/v1/friends/${friendId}`,
  )
  return data.data
}

export function useDeleteFriend() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })
}
