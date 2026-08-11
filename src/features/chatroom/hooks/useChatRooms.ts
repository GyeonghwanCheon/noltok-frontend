import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomListResponse } from '@/features/chatroom/types'

interface ChatRoomCursor {
  cursorTimestamp?: string
  cursorRoomId?: number
}

async function fetchChatRooms(cursor: ChatRoomCursor | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<ChatRoomListResponse>>('/api/v1/chat/rooms', {
    params: { ...cursor, size },
  })
  return data.data
}

export function useChatRooms() {
  return useInfiniteQuery({
    queryKey: ['chatRooms'],
    queryFn: ({ pageParam }) => fetchChatRooms(pageParam),
    initialPageParam: undefined as ChatRoomCursor | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext
        ? {
            cursorTimestamp: lastPage.nextCursorTimestamp ?? undefined,
            cursorRoomId: lastPage.nextCursorRoomId ?? undefined,
          }
        : undefined,
  })
}
