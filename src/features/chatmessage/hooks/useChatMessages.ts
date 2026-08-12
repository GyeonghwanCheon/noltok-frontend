import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatMessageListResponse } from '@/features/chatmessage/types'

async function fetchChatMessages(roomId: number, cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<ChatMessageListResponse>>(
    `/api/v1/chat/rooms/${roomId}/messages`,
    { params: { cursor, size } },
  )
  return data.data
}

export function useChatMessages(roomId: number) {
  return useInfiniteQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: ({ pageParam }) => fetchChatMessages(roomId, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  })
}
