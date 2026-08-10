import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { SendFriendRequestResponse } from '@/features/friend/types'

async function sendFriendRequest(nickname: string) {
  const { data } = await apiClient.post<ApiResponse<SendFriendRequestResponse>>(
    '/api/v1/friends/request',
    { nickname },
  )
  return data.data
}

export function useSendFriendRequest() {
  return useMutation({
    mutationFn: sendFriendRequest,
  })
}
