import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomSearchResponse } from '@/features/chatroom/types'

async function searchRooms(name: string, cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<ChatRoomSearchResponse>>(
    '/api/v1/chat/rooms/search',
    { params: { name, cursor, size } },
  )
  return data.data
}

export function useSearchRooms(name: string) {
  return useInfiniteQuery({
    queryKey: ['chatRooms', 'search', name],
    queryFn: ({ pageParam }) => searchRooms(name, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    enabled: name.length > 0,
  })
}
