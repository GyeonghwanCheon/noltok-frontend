import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomDetailResponse } from '@/features/chatroom/types'

async function fetchChatRoomDetail(roomId: number) {
  const { data } = await apiClient.get<ApiResponse<ChatRoomDetailResponse>>(
    `/api/v1/chat/rooms/${roomId}`,
  )
  return data.data
}

export function useChatRoomDetail(roomId: number) {
  return useQuery({
    queryKey: ['chatRoomDetail', roomId],
    queryFn: () => fetchChatRoomDetail(roomId),
  })
}
