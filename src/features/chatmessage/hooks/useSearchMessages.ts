import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatMessageListResponse } from '@/features/chatmessage/types'

async function searchMessages(roomId: number, keyword: string, cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<ChatMessageListResponse>>(
    `/api/v1/chat/rooms/${roomId}/messages/search`,
    { params: { keyword, cursor, size } },
  )
  return data.data
}

export function useSearchMessages(roomId: number, keyword: string) {
  return useInfiniteQuery({
    queryKey: ['chatMessages', roomId, 'search', keyword],
    queryFn: ({ pageParam }) => searchMessages(roomId, keyword, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    // 백엔드가 1글자는 LIKE로, 2글자 이상은 FULLTEXT로 처리하므로 프론트는 빈 문자열만 막으면 됨
    enabled: keyword.length > 0,
  })
}
